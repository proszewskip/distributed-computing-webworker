import fetch from 'isomorphic-unfetch';
import React, { Component } from 'react';
import ReactTable, { Column } from 'react-table';

import 'react-table/react-table.css';

const columns: Column[] = [
  { accessor: 'name', Header: 'Name' },
  {
    accessor: 'main-dll-name',
    Header: 'Main DLL name',
  },
];

const serverIp = 'http://localhost:5000';
const entityPath = '/distributed-task-definitions';
const urlToFetch = `${serverIp}${entityPath}`;

interface ProblemPluginInfo {
  'assembly-name': string;
  namespace: string;
  'class-name': string;
}

interface DistributedTaskDefinition {
  name: string;
  description: string;
  'definition-guid': string;
  'main-dll-name': string;
  'problem-plugin-info': ProblemPluginInfo;
  'packager-logs': string;
}

interface TableExampleProps {
  data: DistributedTaskDefinition[];
}

class TableExample extends Component<TableExampleProps> {
  public static async getInitialProps(): Promise<Partial<TableExampleProps>> {
    const body = await fetch(urlToFetch).then((res) => res.json());
    const data = body.data.map((entity: any) => entity.attributes);

    return {
      data,
    };
  }

  public render() {
    const { data } = this.props;

    return <ReactTable data={data} columns={columns} />;
  }
}

export default TableExample;
