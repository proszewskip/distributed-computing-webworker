import { Pane } from 'evergreen-ui';
import React, { Component } from 'react';

import { Layout, LayoutProps } from 'components/layout';

import {
  DistributedNodesTable,
  DistributedNodesTableOwnProps,
} from 'features/distributed-nodes/table';

import { getEntities } from 'utils/table/get-entities';

import { transformRequestError } from 'error-handling';
import { DistributedNode } from 'models';
import {
  AppPageComponentType,
  AuthenticatedSidebar,
  BaseDependenciesProvider,
  Head,
} from 'product-specific';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

type DistributedNodesPageProps = DistributedNodesTableOwnProps;

type GetInitialPropsFn = AppPageComponentType<
  DistributedNodesPageProps
>['getInitialProps'];

export default class DistributedNodesPage extends Component<
  DistributedNodesPageProps
> {
  public static getInitialProps: GetInitialPropsFn = ({
    kitsuFactory,
    handleAuthenticationError,
  }) => {
    const kitsu = kitsuFactory();

    return getEntities<DistributedNode>(kitsu, 'distributed-node')
      .catch(handleAuthenticationError)
      .catch(
        (error): DistributedNodesPageProps => ({
          data: [],
          totalRecordsCount: 0,
          dataFetchingError: transformRequestError(error),
        }),
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
