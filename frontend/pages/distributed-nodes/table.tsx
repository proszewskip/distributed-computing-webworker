import { Pane } from 'evergreen-ui';
import { Omit } from 'lodash';
import Head from 'next/head';
import React, { Component } from 'react';

import { Layout, LayoutProps } from 'components/layout';

import {
  DistributedNodeModel,
  DistributedNodesTable,
  DistributedNodesTableProps,
} from 'features/distributed-nodes/table';

import { getEntities } from 'utils/table/get-entities';

import { AuthenticatedSidebar } from 'product-specific';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

interface TablePageProps extends Omit<DistributedNodesTableProps, 'data'> {
  data: DistributedNodeModel[];
}

export default class TableExamplePage extends Component<TablePageProps> {
  public static async getInitialProps(): Promise<Partial<TablePageProps>> {
    return getEntities<DistributedNodeModel>('distributed-node');
  }

  public render() {
    return (
      <>
        <Head />

        <Layout renderSidebar={renderSidebar}>
          <Pane marginX={16}>
            <DistributedNodesTable {...this.props} />
          </Pane>
        </Layout>
      </>
    );
  }
}
