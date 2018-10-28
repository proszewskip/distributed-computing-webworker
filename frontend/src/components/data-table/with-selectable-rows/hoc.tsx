import { Set } from 'immutable';
import memoizeOne from 'memoize-one';
import { ComponentType, PureComponent } from 'react';

import { getDisplayName } from 'utils/get-display-name';

import { SelectCheckbox } from 'components/data-table/styled-data-table';
import { Entity } from 'models';

export interface WithSelectableRowsAdditionalProps {
  selectedRowIds: Set<string>;
  onSelectionChange?: (selectedRowIds: Set<string>) => any;
}

// TODO: enforce that Props extends SelectTableHOC props
// After https://github.com/DefinitelyTyped/DefinitelyTyped/pull/30074 is merged
export function withSelectableRows<Props extends any>(
  WrappedComponent: ComponentType<any>,
) {
  type WithSelectableRowsProps = Props & WithSelectableRowsAdditionalProps;

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
        />
      );
    }

    private isSelected = (id: string) => this.props.selectedRowIds.has(id);

    private toggleSelection = (id: string) => {
      const { selectedRowIds, onSelectionChange } = this.props;

      if (this.isSelected(id)) {
        onSelectionChange(selectedRowIds.delete(id));
      } else {
        onSelectionChange(selectedRowIds.add(id));
      }
    };

    private toggleAll = () => {
      const { onSelectionChange } = this.props;
      if (this.areAllSelected()) {
        return onSelectionChange(Set());
      }

      const { data, selectedRowIds } = this.props;
      const updatedSelectedRowIds = selectedRowIds.merge(
        data.map((entity: Entity) => entity.id),
      );

      onSelectionChange(updatedSelectedRowIds);
    };
  }

  return WithSelectableRows;
}

const areAllSelectedFactory = () =>
  memoizeOne(
    (data: Set<Entity>, selectedRowIds: Set<string>) =>
      data.size > 0 && data.every((entity) => selectedRowIds.has(entity.id)),
  );
