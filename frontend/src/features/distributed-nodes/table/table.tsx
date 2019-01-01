import { Heading, Pane, Text } from 'evergreen-ui';
import { List } from 'immutable';
import React, { Component } from 'react';
import { Column, Filter } from 'react-table';

import { LongTextCell, TextCell } from 'components/data-table/cells';
import { DataTable, DataTableProps } from 'components/data-table/data-table';
import {
  DataTableView,
  DataTableViewProps,
} from 'components/data-table/data-table-view';
import {
  RefreshActionButton,
  ToggleFiltersActionButton,
} from 'components/data-table/data-table-view/action-buttons';
import { DataTableError } from 'components/data-table/errors';
import {
  isNumericFilterValid,
  NumericFilter,
  TextFilter,
} from 'components/data-table/filters';

import {
  DependenciesExtractor,
  withDependencies,
} from 'components/dependency-injection/with-dependencies';

import { getEntities } from 'utils/table/get-entities';
import { preventPropagationHandler } from 'utils/table/prevent-propagation-handler';

import { transformRequestError } from 'error-handling';
import { DistributedNode } from 'models';
import { BaseDependencies } from 'product-specific';

import { DateCell } from './date-cell';
import { EditNodeButton } from './edit-node-button';
import {
  DistributedNodesTableDependencies,
  DistributedNodesTableProps,
  DistributedNodesTableState,
} from './types';

export class PureDistributedNodesTable extends Component<
  DistributedNodesTableProps,
  DistributedNodesTableState
> {
  private filterableColumnIds = ['id', 'trust-level'];
  private columns: Column[] = [
    {
      id: 'id',
      accessor: 'id',
      Header: <Text>Name</Text>,
      Cell: LongTextCell,
      Filter: TextFilter,
      minWidth: 150,
    },
    {
      accessor: 'last-keep-alive-time',
      Header: <Text>Last alive</Text>,
      Cell: DateCell,
      minWidth: 150,
    },
    {
      id: 'trust-level',
      accessor: 'trust-level',
      Header: <Text>Trust level</Text>,
      Cell: TextCell,
      Filter: NumericFilter,
      minWidth: 100,
    },
    {
      id: 'action',
      Header: <Text>Action</Text>,
      Cell: (cellProps) => (
        <Pane onClick={preventPropagationHandler}>
          <EditNodeButton
            forceFetchData={this.state.forceFetchDataCallback}
            cellInfo={cellProps}
          />
        </Pane>
      ),
      minWidth: 150,
    },
  ];

  constructor(props: DistributedNodesTableProps) {
    super(props);

    const { data } = props;

    this.state = {
      ...props,
      data: List(data),
      loading: false,
      filteringEnabled: false,
      forceFetchDataCallback: () => null,
    };
  }

  public render() {
    const {
      data,
      totalRecordsCount,
      loading,
      filteringEnabled,
      dataFetchingError,
    } = this.state;

    return (
      <DataTableView
        header={<Heading size={600}>Distributed Nodes</Heading>}
        renderActionButtons={this.renderActionButtons}
      >
        {dataFetchingError && <DataTableError error={dataFetchingError} />}
        <DataTable
          data={data}
          columns={this.columns}
          filterableColumnIds={this.filterableColumnIds}
          filteringEnabled={filteringEnabled}
          loading={loading}
          totalRecordsCount={totalRecordsCount}
          onFetchData={this.fetchData}
          initialPage={1}
          initialPageSize={10}
          getForceFetchData={this.getFetchDataCallback}
        />
      </DataTableView>
    );
  }

  private fetchData: DataTableProps['onFetchData'] = ({
    filtered,
    pageSize,
    page,
  }) => {
    this.setState({ loading: true, dataFetchingError: undefined });

    filtered = this.removeInvalidFilters(filtered);

    const { kitsu } = this.props;

    return getEntities<DistributedNode>(
      kitsu,
      'distributed-node',
      filtered,
      page,
      pageSize,
    )
      .then(({ data, totalRecordsCount }) => {
        this.setState({
          data: List(data),
          totalRecordsCount,
        });
      })
      .catch((error) => {
        this.setState({
          data: List(),
          dataFetchingError: transformRequestError(error),
        });
      })
      .then(() => {
        this.setState({
          loading: false,
        });
      });
  };

  private renderActionButtons: DataTableViewProps['renderActionButtons'] = () => (
    <>
      <RefreshActionButton
        onClick={this.state.forceFetchDataCallback}
        disabled={this.state.loading}
      />
      <ToggleFiltersActionButton
        filtersEnabled={this.state.filteringEnabled}
        onClick={this.toggleFilters}
      />
    </>
  );

  private toggleFilters = () => {
    this.setState(
      ({ filteringEnabled }) => ({
        filteringEnabled: !filteringEnabled,
      }),
      this.state.forceFetchDataCallback,
    );
  };

  private getFetchDataCallback: DataTableProps['getForceFetchData'] = (
    fetchData,
  ) => {
    this.setState({
      forceFetchDataCallback: fetchData,
      // NOTE: data is reassigned in order to re-render table so that forceFetchDataCallback is propagated
      data: List(this.state.data.toArray()),
    });
  };

  private removeInvalidFilters = (filtered: Filter[]) => {
    return filtered.filter((filterObject) => {
      if (filterObject.id === 'trust-level') {
        return isNumericFilterValid(filterObject.value);
      }

      return true;
    });
  };
}

const dependenciesExtractor: DependenciesExtractor<
  BaseDependencies,
  DistributedNodesTableDependencies
> = ({ kitsu }) => ({ kitsu });

export const DistributedNodesTable = withDependencies(dependenciesExtractor)(
  PureDistributedNodesTable,
);
