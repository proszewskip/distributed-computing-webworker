import { Pane } from 'evergreen-ui';
import { NextComponentClass } from 'next';
import React, { Component } from 'react';

import { Layout, LayoutProps } from 'components/layout';

import {
  DistributedNodesTable,
  DistributedNodesTableOwnProps,
} from 'features/distributed-nodes/table';

import { getEntities } from 'utils/table/get-entities';

import { DistributedNode } from 'models';
import {
  AuthenticatedSidebar,
  BaseDependenciesProvider,
  Head,
  isomorphicGetBaseUrl,
  kitsuFactory,
} from 'product-specific';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

type DistributedNodesPageProps = DistributedNodesTableOwnProps;

type GetInitialPropsFn = NextComponentClass<
  DistributedNodesPageProps
>['getInitialProps'];

export default class DistributedNodesPage extends Component<
  DistributedNodesPageProps
> {
  public static getInitialProps: GetInitialPropsFn = ({ req }) => {
    const kitsu = kitsuFactory({
      baseURL: isomorphicGetBaseUrl(req),
    });

    return getEntities<DistributedNode>(kitsu, 'distributed-node');
  };

  public render() {
    return (
      <>
        <Head />
        <BaseDependenciesProvider>
          <Layout renderSidebar={renderSidebar}>
            <Pane marginX={16}>
              <DistributedNodesTable {...this.props} />
            </Pane>
          </Layout>
        </BaseDependenciesProvider>
      </>
    );
  }
}
