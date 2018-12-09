import { Button, Heading, minorScale, Pane, Text, toaster } from 'evergreen-ui';
import fetch from 'isomorphic-unfetch';
import React, { Component, MouseEventHandler } from 'react';
import { Column } from 'react-table';

import { List, Set } from 'immutable';

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
  DeleteActionButton,
  RefreshActionButton,
  ToggleFiltersActionButton,
} from 'components/data-table/data-table-view/action-buttons';
import { TextFilter } from 'components/data-table/styled-data-table';
import { TableWithSummaryProps } from 'components/data-table/styled-data-table/table-with-summary';
import {
  withSelectableRows,
  WithSelectableRowsAdditionalProps,
} from 'components/data-table/with-selectable-rows';
import { Layout, LayoutProps } from 'components/layout';
import { Link } from 'components/link';

import { DistributedTaskDefinition } from 'models';

import { AuthenticatedSidebar, Head, kitsuFactory } from 'product-specific';

const SelectDataTable = selectTableHOC(DataTable);
const Table = withSelectableRows(SelectDataTable);

const TextCell = (row: { value: any }) => <Text>{row.value}</Text>;

const serverIp = 'http://localhost:5000';
const entityPath = '/distributed-task-definitions';
const distributedTaskDefinitionsUrl = `${serverIp}${entityPath}`;

interface TableExampleProps {
  data: DistributedTaskDefinition[];
  totalRecordsCount: number;
}

interface TableExampleState extends Omit<TableExampleProps, 'data'> {
  data: List<DistributedTaskDefinition>;
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

class TableExample extends Component<TableExampleProps, TableExampleState> {
  private filterableColumnIds = ['name'];
  private columns: Column[] = [
    {
      id: 'name',
      accessor: 'name',
      Header: <Text>Name</Text>,
      Cell: TextCell,
      Filter: TextFilter,
      minWidth: 150,
    },
    {
      accessor: 'main-dll-name',
      Header: <Text>Main DLL name</Text>,
      Cell: TextCell,
      minWidth: 150,
    },
    {
      id: 'action',
      Header: <Text>Action</Text>,
      Cell: (cellProps) => (
        <Pane onClick={preventPropagationHandler}>
          <Button
            marginRight={minorScale(2)}
            iconBefore="trash"
            intent="danger"
            onClick={this.onDeleteButtonClick(cellProps.original.id)}
          >
            Delete
          </Button>

          <Link
            route={`/distributed-task-definitions/${
              cellProps.original.id
            }/edit`}
          >
            <Button iconBefore="edit" marginRight={minorScale(2)}>
              Edit
            </Button>
          </Link>

          <Link
            route={`/distributed-task-definitions/${cellProps.original.id}`}
          >
            <Button iconBefore="chevron-right">See details</Button>
          </Link>
        </Pane>
      ),
      minWidth: 290,
    },
  ];

  constructor(props: TableExampleProps) {
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

    const { data, totalRecordsCount } = await getEntities<
      DistributedTaskDefinition
    >(distributedTaskDefinitionsUrl, searchParams, page, pageSize);

    this.setState({
      data: List(data),
      totalRecordsCount,
      loading: false,
    });
  };

  private onDeleteButtonClick = (id: string) => () => {
    const kitsu = kitsuFactory();

    kitsu.delete('distributed-task-definition', id).then(() => {
      toaster.success('The entity has been deleted');
      this.forceFetchData();
    });
  };

  private renderActionButtons: DataTableViewProps['renderActionButtons'] = () => (
    <>
      <RefreshActionButton
        onClick={this.forceFetchData}
        disabled={this.state.loading}
      />
      <DeleteActionButton
        onClick={this.onBulkActionExampleClick}
        disabled={this.state.selectedRowIds.size === 0}
      />
      <ToggleFiltersActionButton
        filtersEnabled={this.state.filteringEnabled}
        onClick={this.toggleFilters}
      />
    </>
  );

  private onBulkActionExampleClick = () => {
    console.log('Selected ids', this.state.selectedRowIds);
  };

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

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

interface TableExamplePageProps extends Omit<TableExampleProps, 'data'> {
  data: DistributedTaskDefinition[];
}

// tslint:disable-next-line:max-classes-per-file
class TableExamplePage extends Component<TableExamplePageProps> {
  public static async getInitialProps(): Promise<
    Partial<TableExamplePageProps>
  > {
    return getEntities<DistributedTaskDefinition>(
      distributedTaskDefinitionsUrl,
    );
  }

  public render() {
    return (
      <>
        <Head />

        <Layout renderSidebar={renderSidebar}>
          <Pane marginX={16}>
            <TableExample {...this.props} />
          </Pane>
        </Layout>
      </>
    );
  }
}

export default TableExamplePage;
