import fetch from 'isomorphic-unfetch';
import React, { Component, GetDerivedStateFromProps } from 'react';
import ReactTable, { Column, TableProps } from 'react-table';

// @ts-ignore (TODO: remove after https://github.com/DefinitelyTyped/DefinitelyTyped/pull/30074 is merged)
import selectTableHOC from 'react-table/lib/hoc/selectTable';

const SelectTable = selectTableHOC(ReactTable);

import 'react-table/react-table.css';

import { DistributedTaskDefinition } from 'models';

const columns: Column[] = [
  { accessor: 'name', Header: 'Name', filterable: true },
  {
    accessor: 'main-dll-name',
    Header: 'Main DLL name',
  },
];

const serverIp = 'http://localhost:5000';
const entityPath = '/distributed-task-definitions';
const distributedTaskDefinitionsUrl = `${serverIp}${entityPath}`;

interface TableExampleProps {
  data: DistributedTaskDefinition[];
  totalRecords: number;
}

interface TableExampleState extends TableExampleProps {
  page: number;
  loading: boolean;
}

async function getEntities<T>(
  baseUrl: string,
  urlSearchParams = new URLSearchParams(),
  page = 1,
  pageSize = 25,
) {
  const paginatedUrl = `${baseUrl}?page[size]=${pageSize}&page[number]=${page}&${urlSearchParams}`;

  const body = await fetch(paginatedUrl).then((res) => res.json());
  const data = (body.data || []).map((entity: any) => entity.attributes) as T[];
  const totalRecords = body.meta['total-records'] as number;

  return {
    data,
    totalRecords,
  };
}

class TableExample extends Component<TableExampleProps, TableExampleState> {
  constructor(props: TableExampleProps) {
    super(props);

    this.state = {
      ...props,
      loading: false,
      page: 1,
    };
  }

  public render() {
    const { data, totalRecords, loading } = this.state;
    const pagesCount = Math.ceil(totalRecords / 25);

    return (
      <ReactTable
        data={data}
        columns={columns}
        pages={pagesCount}
        loading={loading}
        manual={true}
        pageSize={25}
        onFetchData={this.onFetchData}
      />
    );
  }

  private onFetchData: TableProps['onFetchData'] = async (state) => {
    const page = state.page + 1;
    this.setState({ loading: true, page });

    const searchParams = new URLSearchParams();
    if (state.filtered) {
      state.filtered.forEach(({ id, value }: any) => {
        searchParams.set(`filter[${id}]`, `like:${value}`);
      });
    }

    const { data, totalRecords } = await getEntities<DistributedTaskDefinition>(
      distributedTaskDefinitionsUrl,
      searchParams,
      page,
    );

    this.setState({
      data,
      totalRecords,
      loading: false,
    });
  };
}

// tslint:disable-next-line:max-classes-per-file
class TableExamplePage extends Component<TableExampleProps> {
  public static async getInitialProps(): Promise<Partial<TableExampleProps>> {
    return getEntities<DistributedTaskDefinition>(
      distributedTaskDefinitionsUrl,
    );
  }

  public render() {
    return <TableExample {...this.props} />;
  }
}

export default TableExamplePage;
