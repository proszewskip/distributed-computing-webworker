import { DistributedNodeModel } from 'features/distributed-nodes/table/types';
import { LayoutProps, Layout } from 'components/layout';
import { AuthenticatedSidebar } from 'product-specific';
import React, { Component } from 'react';
import { Omit } from 'lodash';
import { DistributedTaskDefinition } from 'models';
import Head from 'next/head';
import { Pane } from 'evergreen-ui';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

interface TableExamplePageProps
  extends Omit<DistributedNodesTableProps, 'data'> {
  data: DistributedTaskDefinition[];
}

// tslint:disable-next-line:max-classes-per-file
export default class TableExamplePage extends Component<TableExamplePageProps> {
  public static async getInitialProps(): Promise<
    Partial<TableExamplePageProps>
  > {
    return getEntities<DistributedNodeModel>(distributedTaskDefinitionsUrl);
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
