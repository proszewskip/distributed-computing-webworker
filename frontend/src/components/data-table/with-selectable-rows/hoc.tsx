import { List, Set } from 'immutable';
import memoizeOne from 'memoize-one';
import React, { ComponentType, PureComponent } from 'react';
import { RowInfo, TableProps } from 'react-table';

import { Subtract } from 'types/subtract';
import { getDisplayName } from 'utils/get-display-name';

import {
  SelectCheckbox,
  StyledDataTableProps,
} from 'components/data-table/styled-data-table';
import { Entity } from 'models';

export interface WithSelectableRowsAdditionalProps {
  selectedRowIds: Set<string>;
  data: StyledDataTableProps['data'];
  onSelectionChange?(selectedRowIds: Set<string>): any;
}

export interface WithSelectableRowsOptionalProps {
  getTrProps?: TableProps['getTrProps'];
}

export interface WithSelectableRowsRequiredProps {
  keyField?: string;
  selectType?: 'checkbox' | 'radio';
  isSelected?: (id: string) => boolean;
  toggleSelection?: (id: string) => any;
  toggleAll?: () => any;
  selectAll?: boolean;
  SelectInputComponent?: ComponentType<any>;
  SelectAllInputComponent?: ComponentType<any>;
}

// TODO: enforce that Props extends SelectTableHOC props
// After https://github.com/DefinitelyTyped/DefinitelyTyped/pull/30074 is merged
export function withSelectableRows<
  Props extends WithSelectableRowsRequiredProps &
    WithSelectableRowsOptionalProps
>(WrappedComponent: ComponentType<Props>) {
  type WithSelectableRowsProps = Subtract<
    Props,
    WithSelectableRowsRequiredProps
  > &
    WithSelectableRowsAdditionalProps;

  class WithSelectableRows extends PureComponent<WithSelectableRowsProps> {
    public static displayName = `withSelectableRows(${getDisplayName(
      WrappedComponent,
    )})`;

    private areAllSelected: () => boolean;

    constructor(props: WithSelectableRowsProps) {
      super(props);

      const memoizedAreAllSelected = areAllSelectedFactory();
      this.areAllSelected = () => {
        const { data, selectedRowIds } = this.props;

        return memoizedAreAllSelected(data, selectedRowIds);
      };
    }

    public render() {
      return (
        <WrappedComponent
          {...this.props}
          keyField="id"
          selectType="checkbox"
          isSelected={this.isSelected}
          toggleSelection={this.toggleSelection}
          toggleAll={this.toggleAll}
          selectAll={this.areAllSelected()}
          SelectInputComponent={SelectCheckbox}
          SelectAllInputComponent={SelectCheckbox}
          getTrProps={this.getTrProps}
        />
      );
    }

    private isSelected = (id: string) => this.props.selectedRowIds.has(id);

    private toggleSelection = (id: string) => {
      const { selectedRowIds, onSelectionChange } = this.props;
      if (!onSelectionChange) {
        return;
      }

      if (this.isSelected(id)) {
        onSelectionChange(selectedRowIds.delete(id));
      } else {
        onSelectionChange(selectedRowIds.add(id));
      }
    };

    private toggleAll = () => {
      const { onSelectionChange } = this.props;

      if (!onSelectionChange) {
        return;
      }

      if (this.areAllSelected()) {
        return onSelectionChange(Set());
      }

      const { data, selectedRowIds } = this.props;
      const updatedSelectedRowIds = selectedRowIds.merge(
        (data as any).map((entity: Entity) => entity.id),
      ) as Set<string>;

      onSelectionChange(updatedSelectedRowIds);
    };

    private getTrProps: TableProps['getTrProps'] = (
      _: any,
      rowInfo?: RowInfo,
    ) => {
      if (!rowInfo) {
        return {};
      }

      return {
        onClick: this.onRowClickFactory(rowInfo.original.id),
      };
    };

    private onRowClickFactory = (rowId: string) => () =>
      this.toggleSelection(rowId);
  }

  return WithSelectableRows;
}

const areAllSelectedFactory = () =>
  memoizeOne(
    (data: List<Entity>, selectedRowIds: Set<string>) =>
      data.size > 0 && data.every((entity) => selectedRowIds.has(entity.id)),
  );
