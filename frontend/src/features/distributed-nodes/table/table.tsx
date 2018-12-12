import { Button, Heading, minorScale, Pane, Text } from 'evergreen-ui';
import { List } from 'immutable';
import React, { Component, MouseEventHandler } from 'react';
import { Column } from 'react-table';

import {
  DataTable,
  DataTableProps,
  ForceFetchData,
} from 'components/data-table/data-table';
import {
  DataTableView,
  DataTableViewProps,
} from 'components/data-table/data-table-view';
import {
  RefreshActionButton,
  ToggleFiltersActionButton,
} from 'components/data-table/data-table-view/action-buttons';
import { TextFilter } from 'components/data-table/styled-data-table';

import { Link } from 'components/link';

import { getEntities } from 'utils/get-entities';
import {
  DistributedNodeModel,
  DistributedNodesTableProps,
  DistributedNodesTableState,
} from './types';

const TextCell = (row: { value: any }) => <Text>{row.value}</Text>;

const preventPropagationHandler: MouseEventHandler = (event) =>
  event.stopPropagation();

export default class DistributedNodesTable extends Component<
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
      Cell: TextCell,
      minWidth: 150,
    },
    {
      accessor: 'trust-level',
      Header: <Text>Trust level</Text>,
      Cell: TextCell,
      minWidth: 150,
    },
    {
      id: 'action',
      Header: <Text>Action</Text>,
      Cell: (cellProps) => (
        <Pane onClick={preventPropagationHandler}>
          <Link
            route={`/distributed-task-definitions/${
              cellProps.original.id
            }/edit`}
          >
            <Button iconBefore="edit" marginRight={minorScale(2)}>
              Edit
            </Button>
          </Link>
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
    };
  }

  public render() {
    const { data, totalRecordsCount, loading, filteringEnabled } = this.state;

    return (
      <DataTableView
        header={<Heading size={600}>Distributed Task definitions</Heading>}
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
    const { filteringEnabled } = this.state;
    this.setState({ loading: true });

    const searchParams = new URLSearchParams();
    if (filtered && filteringEnabled) {
      filtered.forEach(({ id, value }: any) => {
        searchParams.set(`filter[${id}]`, `like:${value}`);
      });
    }

    const { data, totalRecordsCount } = await getEntities<DistributedNodeModel>(
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
        onClick={this.getForceFetchData}
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
      this.forceFetchData,
    );
  };

  private forceFetchData: ForceFetchData = () => null;

  private getForceFetchData: ForceFetchData = () => {
    this.forceFetchData();
  };

  private getFetchDataCallback: DataTableProps['getForceFetchData'] = (
    fetchData,
  ) => {
    this.forceFetchData = fetchData;
  };
}
