import { Button, Heading, minorScale, Text } from 'evergreen-ui';
import fetch from 'isomorphic-unfetch';
import debounce from 'lodash.debounce';
import React, { Component } from 'react';
import {
  Column,
  Filter,
  FilteredChangeFunction,
  TableProps,
} from 'react-table';

import { List } from 'immutable';

// @ts-ignore (TODO: remove after https://github.com/DefinitelyTyped/DefinitelyTyped/pull/30074 is merged)
import selectTableHOC from 'react-table/lib/hoc/selectTable';

import 'react-table/react-table.css';

import { Omit } from 'types/omit';

import {
  DataTableView,
  DataTableViewProps,
} from 'components/data-table/data-table-view';
import {
  DeleteActionButton,
  RefreshActionButton,
  ToggleFiltersActionButton,
} from 'components/data-table/data-table-view/action-buttons';
import {
  SelectCheckbox,
  StyledDataTable,
  TextFilter,
} from 'components/data-table/styled-data-table';
import { TableWithSummaryProps } from 'components/data-table/styled-data-table/table-with-summary';

import { DistributedTaskDefinition } from 'models';

const SelectTable = selectTableHOC(StyledDataTable);

const TextCell = (row: { value: any }) => <Text>{row.value}</Text>;

const serverIp = 'http://localhost:5000';
const entityPath = '/distributed-task-definitions';
const distributedTaskDefinitionsUrl = `${serverIp}${entityPath}`;

interface TableExampleProps {
  data: DistributedTaskDefinition[];
  totalRecords: number;
}

interface TableExampleState extends Omit<TableExampleProps, 'data'> {
  data: List<DistributedTaskDefinition>;
  page: number;
  pageSize: number;
  loading: boolean;
  selectedRowIds: string[];
  filtered: Filter[];
  filtersEnabled: boolean;
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
  const totalRecords = body.meta['total-records'] as number;

  return {
    data,
    totalRecords,
  };
}

class TableExample extends Component<TableExampleProps, TableExampleState> {
  private debouncedFetchData: () => any;

  constructor(props: TableExampleProps) {
    super(props);

    const { data } = props;

    this.state = {
      ...props,
      data: List(data),
      loading: false,
      page: 1,
      pageSize: 20,
      selectedRowIds: [],
      filtered: [],
      filtersEnabled: false,
    };

    this.debouncedFetchData = debounce(this.fetchData, 250);
  }

  public render() {
    const { data, totalRecords, loading, pageSize, filtered } = this.state;
    const pagesCount = Math.ceil(totalRecords / pageSize);

    return (
      <div>
        <DataTableView
          header={<Heading size={600}>Distributed Task definitions</Heading>}
          renderActionButtons={this.renderActionButtons}
        >
          <SelectTable
            data={data}
            resolveData={this.resolveData}
            columns={this.getColumns()}
            pages={pagesCount}
            loading={loading}
            manual={true}
            pageSize={pageSize}
            onPageSizeChange={this.onPageSizeChange}
            filtered={filtered}
            onFilteredChange={this.onFilteredChange}
            onPageChange={this.onPageChange}
            sortable={false}
            // SelectTable props
            keyField="id"
            isSelected={this.isSelected}
            toggleSelection={this.toggleSelection}
            selectType="checkbox"
            toggleAll={this.toggleAll}
            selectAll={this.areAllSelected()}
            renderSummary={this.renderSummary}
            SelectInputComponent={SelectCheckbox}
            SelectAllInputComponent={SelectCheckbox}
          />
        </DataTableView>
      </div>
    );
  }

  private getColumns = (): Column[] => [
    {
      accessor: 'name',
      Header: <Text>Name</Text>,
      Cell: TextCell,
      filterable: this.state.filtersEnabled,
      Filter: TextFilter,
    },
    {
      accessor: 'main-dll-name',
      Header: <Text>Main DLL name</Text>,
      Cell: TextCell,
    },
    {
      id: 'action',
      Header: <Text>Action</Text>,
      Cell: (cellProps: any) => (
        <Button
          appearance="primary"
          intent="danger"
          onClick={this.onRowClick(cellProps.original)}
        >
          Remove
        </Button>
      ),
    },
  ];

  private renderSummary: TableWithSummaryProps['renderSummary'] = () => (
    <Text size={600} marginY={minorScale(2)}>
      Selected {this.state.selectedRowIds.length} out of{' '}
      {this.state.totalRecords} elements.
    </Text>
  );

  private resolveData = (data: List<DistributedTaskDefinition>) => data.toJS();

  private fetchData = async () => {
    const { page, pageSize, filtered, filtersEnabled } = this.state;
    this.setState({ loading: true, page });

    const searchParams = new URLSearchParams();
    if (filtered && filtersEnabled) {
      filtered.forEach(({ id, value }: any) => {
        searchParams.set(`filter[${id}]`, `like:${value}`);
      });
    }

    const { data, totalRecords } = await getEntities<DistributedTaskDefinition>(
      distributedTaskDefinitionsUrl,
      searchParams,
      page,
      pageSize,
    );

    this.setState({
      data: List(data),
      totalRecords,
      loading: false,
    });
  };

  private isSelected = (id: string) => this.state.selectedRowIds.includes(id);

  private toggleSelection = (id: string) => {
    const { selectedRowIds } = this.state;
    const index = selectedRowIds.indexOf(id);

    if (index === -1) {
      this.setState({
        selectedRowIds: [...selectedRowIds, id],
      });
    } else {
      const previousSlice = selectedRowIds.slice(0, index);
      const nextSlice = selectedRowIds.slice(index + 1);

      this.setState({
        selectedRowIds: [...previousSlice, ...nextSlice],
      });
    }
  };

  private toggleAll = () => {
    if (this.areAllSelected()) {
      this.setState({
        selectedRowIds: [],
      });
    } else {
      const notSelectedIds = this.state.data
        .filter((definition) => !this.isSelected(definition.id))
        .map((definition) => definition.id);

      this.setState({
        selectedRowIds: [...this.state.selectedRowIds, ...notSelectedIds],
      });
    }
  };

  private areAllSelected = () =>
    this.state.data.size > 0 &&
    this.state.data.every((entity) => this.isSelected(entity.id));

  private onBulkActionExampleClick = () => {
    console.log('Selected ids', this.state.selectedRowIds);
  };

  private onPageSizeChange: TableProps['onPageSizeChange'] = (pageSize) => {
    this.setState(
      {
        pageSize,
      },
      this.fetchData,
    );
  };

  private onPageChange: TableProps['onPageChange'] = (page) => {
    this.setState(
      {
        page: page + 1,
      },
      this.fetchData,
    );
  };

  private onFilteredChange: FilteredChangeFunction = (filtered) => {
    this.setState(
      {
        filtered,
      },
      this.debouncedFetchData,
    );
  };

  private onRowClick = (value: any) => () => {
    console.log('Clicked', value);
  };

  private renderActionButtons: DataTableViewProps['renderActionButtons'] = () => (
    <>
      <RefreshActionButton
        onClick={this.fetchData}
        disabled={this.state.loading}
      />
      <DeleteActionButton
        onClick={this.onBulkActionExampleClick}
        disabled={this.state.selectedRowIds.length === 0}
      />
      <ToggleFiltersActionButton
        filtersEnabled={this.state.filtersEnabled}
        onClick={this.toggleFilters}
      />
    </>
  );

  private toggleFilters = () => {
    this.setState(
      ({ filtersEnabled }) => ({
        filtersEnabled: !filtersEnabled,
      }),
      this.fetchData,
    );
  };
}

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
    return <TableExample {...this.props} />;
  }
}

export default TableExamplePage;
