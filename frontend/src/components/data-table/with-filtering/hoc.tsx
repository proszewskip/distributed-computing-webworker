import { memoize } from 'ramda';
import { ComponentType, PureComponent } from 'react';
import { Column } from 'react-table';

import { getDisplayName } from 'utils/get-display-name';
import { StyledDataTableProps } from '../styled-data-table';

export interface WithFilteringRequiredProps {
  columns?: StyledDataTableProps['columns'];
}

export interface WithFilteringAdditionalProps {
  filterableColumnIds: string[];
  filteringEnabled: boolean;
}

export function withFiltering<Props extends WithFilteringRequiredProps>(
  WrappedComponent: ComponentType<Props>,
) {
  type WithFilteringProps = Props & WithFilteringAdditionalProps;
  class WithFiltering extends PureComponent<WithFilteringProps> {
    public static displayName = `withFiltering(${getDisplayName(
      WrappedComponent,
    )})`;

    private getColumns: () => Column[];

    constructor(props: WithFilteringProps) {
      super(props);

      const memoizedGetColumns = getColumnsFactory();
      this.getColumns = () => {
        const { columns, filteringEnabled, filterableColumnIds } = this.props;

        return memoizedGetColumns(
          columns as Column[],
          filterableColumnIds,
          filteringEnabled,
        );
      };
    }

    public render() {
      return <WrappedComponent {...this.props} columns={this.getColumns()} />;
    }
  }

  return WithFiltering;
}

const getColumnsFactory = () =>
  memoize(
    (
      columns: Column[],
      filterableColumnIds: string[],
      filteringEnabled: boolean,
    ) => [
      ...columns.map(
        (column) =>
          filteringEnabled && filterableColumnIds.includes(column.id as string)
            ? { ...column, filterable: true }
            : column,
      ),
    ],
  );
