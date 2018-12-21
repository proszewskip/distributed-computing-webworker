import { Pane } from 'evergreen-ui';
import { NextComponentClass } from 'next';
import React, { Component } from 'react';

import { Layout, LayoutProps } from 'components/layout';

import {
  handleAuthenticationErrorFactory,
  redirectToLoginPage,
} from 'features/authentication';
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
  kitsuFactory,
} from 'product-specific';

import { routes } from '../../routes';

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
  public static getInitialProps: GetInitialPropsFn = ({ res }) => {
    const kitsu = kitsuFactory();

    const handleAuthenticationError = handleAuthenticationErrorFactory<
      DistributedNodesPageProps
    >(redirectToLoginPage({ res, router: routes.Router }));

    return getEntities<DistributedNode>(kitsu, 'distributed-node').catch(
      handleAuthenticationError,
    );
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
