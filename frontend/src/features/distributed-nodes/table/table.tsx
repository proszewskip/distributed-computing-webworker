import { Button, Heading, minorScale, Pane, Text } from 'evergreen-ui';
import { List, Set } from 'immutable';
import fetch from 'isomorphic-unfetch';
import React, { Component, MouseEventHandler } from 'react';
import { Column } from 'react-table';
import selectTableHOC from 'react-table/lib/hoc/selectTable';

import { Omit } from 'types/omit';

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
import { TableWithSummaryProps } from 'components/data-table/styled-data-table/table-with-summary';
import {
  withSelectableRows,
  WithSelectableRowsAdditionalProps,
} from 'components/data-table/with-selectable-rows';

import { Link } from 'components/link';

import { DistributedNodeModel } from './types';

import { config } from 'product-specific';

const SelectDataTable = selectTableHOC(DataTable);
const Table = withSelectableRows(SelectDataTable);

const TextCell = (row: { value: any }) => <Text>{row.value}</Text>;

const distributedTaskDefinitionsUrl = `${config.serverUrl}${entityPath}`;

interface DistributedNodesTableProps {
  data: DistributedNodeModel[];
  totalRecordsCount: number;
}

interface DistributedNodesTableState
  extends Omit<DistributedNodesTableProps, 'data'> {
  data: List<DistributedNodeModel>;
  loading: boolean;
  selectedRowIds: WithSelectableRowsAdditionalProps['selectedRowIds'];
  filteringEnabled: boolean;
}

async function getEntities<T extends { id: string }>(
  baseUrl: string,
  urlSearchParams = new URLSearchParams(),
  page = 1,
  pageSize = 20,
) {
  // TODO: use kitsu
  const paginatedUrl = `${baseUrl}?page[size]=${pageSize}&page[number]=${page}&${urlSearchParams}`;

  const body = await fetch(paginatedUrl).then((res) => res.json());
  const data = (body.data || []).map((entity: any) => ({
    ...entity.attributes,
    id: entity.id,
  })) as T[];
  const totalRecordsCount = body.meta['total-records'] as number;

  return {
    data,
    totalRecordsCount,
  };
}

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
      selectedRowIds: Set(),
      filteringEnabled: false,
    };
  }

  public render() {
    const {
      data,
      totalRecordsCount,
      loading,
      selectedRowIds,
      filteringEnabled,
    } = this.state;

    return (
      <DataTableView
        header={<Heading size={600}>Distributed Task definitions</Heading>}
        renderActionButtons={this.renderActionButtons}
      >
        <Table
          data={data}
          columns={this.columns}
          filterableColumnIds={this.filterableColumnIds}
          filteringEnabled={filteringEnabled}
          loading={loading}
          selectedRowIds={selectedRowIds}
          onSelectionChange={this.onSelectionChange}
          renderSummary={this.renderSummary}
          totalRecordsCount={totalRecordsCount}
          onFetchData={this.fetchData}
          initialPage={1}
          initialPageSize={20}
          getForceFetchData={this.getFetchDataCallback}
        />
      </DataTableView>
    );
  }

  private renderSummary: TableWithSummaryProps['renderSummary'] = () => (
    <Text size={600} marginY={minorScale(2)}>
      Selected {this.state.selectedRowIds.size} out of{' '}
      {this.state.totalRecordsCount} elements.
    </Text>
  );

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
      distributedTaskDefinitionsUrl,
      searchParams,
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
        onClick={this.forceFetchData}
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

  private onSelectionChange: WithSelectableRowsAdditionalProps['onSelectionChange'] = (
    selectedRowIds,
  ) => this.setState({ selectedRowIds });

  private forceFetchData: ForceFetchData = () => null;

  private getFetchDataCallback: DataTableProps['getForceFetchData'] = (
    fetchData,
  ) => {
    this.forceFetchData = fetchData;
  };
}
