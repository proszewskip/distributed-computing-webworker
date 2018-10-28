import { Button, minorScale, Pane, Strong, Text } from 'evergreen-ui';
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

import { StyledDataTable } from 'components/data-table/styled-data-table/styled-data-table';
import { TableWithSummaryProps } from 'components/data-table/styled-data-table/table-with-summary';

import { DistributedTaskDefinition } from 'models';

const SelectTable = selectTableHOC(StyledDataTable);

const TextCell = (row: { value: any }) => <Text>{row.value}</Text>;

const columns: Column[] = [
  {
    accessor: 'name',
    Header: <Text>Name</Text>,
    Cell: TextCell,
    filterable: true,
  },
  {
    accessor: 'main-dll-name',
    Header: <Text>Main DLL name</Text>,
    Cell: TextCell,
  },
];

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
    };

    columns.push({
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
    });

    this.debouncedFetchData = debounce(this.fetchData, 250);
  }

  public render() {
    const {
      data,
      totalRecords,
      loading,
      selectedRowIds,
      pageSize,
      filtered,
    } = this.state;
    const pagesCount = Math.ceil(totalRecords / pageSize);

    return (
      <div>
        <Button appearance="primary" onClick={this.onClickExample}>
          Bulk action for selected elements
        </Button>
        <SelectTable
          data={data}
          resolveData={this.resolveData}
          columns={columns}
          pages={pagesCount}
          loading={loading}
          manual={true}
          pageSize={pageSize}
          onPageSizeChange={this.onPageSizeChange}
          filtered={filtered}
          onFilteredChange={this.onFilteredChange}
          onPageChange={this.onPageChange}
          sortable={false}
          getTableProps={this.getTableProps}
          // SelectTable props
          keyField="id"
          isSelected={this.isSelected}
          toggleSelection={this.toggleSelection}
          selectType="checkbox"
          toggleAll={this.toggleAll}
          selectAll={this.areAllSelected()}
        />
        Selected {selectedRowIds.length} out of {totalRecords} elements.
      </div>
    );
  }

  private resolveData = (data: List<DistributedTaskDefinition>) => data.toJS();

  private fetchData = async () => {
    const { page, pageSize, filtered } = this.state;
    this.setState({ loading: true, page });

    const searchParams = new URLSearchParams();
    if (filtered) {
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

  private onClickExample = () => {
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

  private getTableProps = (): TableWithSummaryProps => ({
    renderSummary: this.renderSummary,
  });

  private renderSummary = () => (
    <Pane borderTop="default" paddingY={minorScale(3)} paddingX={minorScale(2)}>
      <Strong size={600}>{this.state.totalRecords}</Strong>{' '}
      <Text size={600}>items in total</Text>
    </Pane>
  );
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
