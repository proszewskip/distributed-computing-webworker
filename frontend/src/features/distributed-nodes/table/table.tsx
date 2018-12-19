import { distanceInWordsToNow } from 'date-fns';
import { Heading, Pane, Text, Tooltip } from 'evergreen-ui';
import { List } from 'immutable';
import React, { Component } from 'react';
import { Column } from 'react-table';

import { TextCell } from 'components/data-table/cells/text-cell';
import { DataTable, DataTableProps } from 'components/data-table/data-table';
import {
  DataTableView,
  DataTableViewProps,
} from 'components/data-table/data-table-view';
import {
  RefreshActionButton,
  ToggleFiltersActionButton,
} from 'components/data-table/data-table-view/action-buttons';
import { TextFilter } from 'components/data-table/filters';

import {
  DependenciesExtractor,
  withDependencies,
} from 'components/dependency-injection/with-dependencies';

import { getEntities } from 'utils/table/get-entities';
import { preventPropagationHandler } from 'utils/table/prevent-propagation-handler';

import { EditNodeButton } from './edit-node-cell';
import {
  DistributedNodesTableDependencies,
  DistributedNodesTableProps,
  DistributedNodesTableState,
} from './types';

import { DistributedNode } from 'models';
import { BaseDependencies } from 'product-specific';

const DateCell = (row: { value: any }) => (
  <Tooltip content={new Date(row.value).toLocaleString()}>
    <Text>{distanceInWordsToNow(row.value)}</Text>
  </Tooltip>
);

export class PureDistributedNodesTable extends Component<
  DistributedNodesTableProps,
  DistributedNodesTableState
> {
  private filterableColumnIds = ['id'];
  private columns: Column[] = [
    {
      id: 'id',
      accessor: 'id',
      Header: <Text>Name</Text>,
      Cell: TextCell,
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
      accessor: 'trust-level',
      Header: <Text>Trust level</Text>,
      Cell: TextCell,
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
    const { data, totalRecordsCount, loading, filteringEnabled } = this.state;

    return (
      <DataTableView
        header={<Heading size={600}>Distributed Nodes</Heading>}
        renderActionButtons={this.renderActionButtons}
      >
        <DataTable
          data={data}
          columns={this.columns}
          filterableColumnIds={this.filterableColumnIds}
          filteringEnabled={filteringEnabled}
          loading={loading}
          totalRecordsCount={totalRecordsCount}
          onFetchData={this.fetchData}
          initialPage={1}
          initialPageSize={20}
          getForceFetchData={this.getFetchDataCallback}
        />
      </DataTableView>
    );
  }

  private fetchData: DataTableProps['onFetchData'] = async ({
    filtered,
    pageSize,
    page,
  }) => {
    this.setState({ loading: true });

    const { kitsu } = this.props;

    const { data, totalRecordsCount } = await getEntities<DistributedNode>(
      kitsu,
      'distributed-node',
      filtered,
      page,
      pageSize,
    );

    this.setState({
      data: List(data),
      totalRecordsCount,
      loading: false,
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
      data: List(this.state.data.toArray()),
    });

    // data is reassigned in order to re-render table
  };
}

const dependenciesExtractor: DependenciesExtractor<
  BaseDependencies,
  DistributedNodesTableDependencies
> = ({ kitsu }) => ({ kitsu });

export const DistributedNodesTable = withDependencies(dependenciesExtractor)(
  PureDistributedNodesTable,
);
