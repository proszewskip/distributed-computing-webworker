import { List, Set } from 'immutable';
import memoizeOne from 'memoize-one';
import React, { ComponentType, PureComponent } from 'react';
import { RowInfo, TableProps } from 'react-table';
import { SelectTableAdditionalProps } from 'react-table/lib/hoc/selectTable';

import { Subtract } from 'types/subtract';
import { getDisplayName } from 'utils/get-display-name';

import {
  SelectAllCheckbox,
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

/**
 * A higher order component that handles selecting rows.
 *
 * @param WrappedComponent
 */
export function withSelectableRows<
  Props extends SelectTableAdditionalProps & WithSelectableRowsOptionalProps
>(WrappedComponent: ComponentType<Props>) {
  type WithSelectableRowsProps = Subtract<Props, SelectTableAdditionalProps> &
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
      /**
       * TODO: remove the `as unknown as Props` assertion after Typescript fixes its bug
       * https://github.com/Microsoft/TypeScript/issues/28938
       */
      return (
        <WrappedComponent
          {...(this.props as unknown) as Props}
          keyField="id"
          selectType="checkbox"
          isSelected={this.isSelected}
          toggleSelection={this.toggleSelection}
          toggleAll={this.toggleAll}
          selectAll={this.areAllSelected()}
          SelectInputComponent={SelectCheckbox}
          SelectAllInputComponent={SelectAllCheckbox}
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
