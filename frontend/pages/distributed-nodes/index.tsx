import { Pane } from 'evergreen-ui';
import Kitsu from 'kitsu';
import { Omit } from 'lodash';
import { NextComponentClass } from 'next';
import Head from 'next/head';
import React, { Component } from 'react';

import { Layout, LayoutProps } from 'components/layout';

import {
  DependenciesExtractor,
  withDependencies,
} from 'components/dependency-injection/with-dependencies';

import {
  DistributedNodesTable,
  DistributedNodesTableProps,
} from 'features/distributed-nodes/table';

import { getEntities } from 'utils/table/get-entities';

import { DistributedNodeModel } from 'models';
import {
  AuthenticatedSidebar,
  BaseDependencies,
  BaseDependenciesProvider,
  kitsuFactory,
} from 'product-specific';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

interface DistributedNodesPageProps
  extends Omit<DistributedNodesTableProps, 'kitsu'> {}

type GetInitialPropsFn = NextComponentClass<
  DistributedNodesPageProps
>['getInitialProps'];

interface DistributedNodesTableDependencies {
  kitsu: Kitsu;
}

const dependenciesExtractor: DependenciesExtractor<
  BaseDependencies,
  DistributedNodesTableDependencies
> = ({ kitsu }) => ({ kitsu });

const DistributedNodesTableWithDependencies = withDependencies(
  dependenciesExtractor,
)(DistributedNodesTable);

export default class DistributedNodesPage extends Component<
  DistributedNodesPageProps
> {
  public static getInitialProps: GetInitialPropsFn = () => {
    const kitsu = kitsuFactory();

    return getEntities<DistributedNodeModel>(kitsu, 'distributed-node');
  };

  public render() {
    return (
      <>
        <Head />
        <BaseDependenciesProvider>
          <Layout renderSidebar={renderSidebar}>
            <Pane marginX={16}>
              <DistributedNodesTableWithDependencies {...this.props} />
            </Pane>
          </Layout>
        </BaseDependenciesProvider>
      </>
    );
  }
}
