import { majorScale, Pane } from 'evergreen-ui';
import React, { Component } from 'react';

import { Layout, LayoutProps } from 'components/layout';

import {
  AppPageComponentType,
  AuthenticatedSidebar,
  BaseDependenciesProvider,
  Head,
} from 'product-specific';

import {
  DistributedTasksTable,
  DistributedTasksTableOwnProps,
  fetchDistributedTasksWithDefinitions,
} from 'features/distributed-tasks';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

type DistributedTasksTablePageProps = DistributedTasksTableOwnProps;

class DistributedTasksTablePage extends Component<
  DistributedTasksTablePageProps
> {
  public static getInitialProps: AppPageComponentType<
    DistributedTasksTablePageProps
  >['getInitialProps'] = ({ kitsuFactory, handleAuthenticationError }) => {
    const kitsu = kitsuFactory();

    return fetchDistributedTasksWithDefinitions(kitsu).catch(
      handleAuthenticationError,
    );
  };

  public render() {
    return (
      <>
        <Head />

        <BaseDependenciesProvider>
          <Layout renderSidebar={renderSidebar}>
            <Pane margin={majorScale(1)}>
              <DistributedTasksTable {...this.props} />
            </Pane>
          </Layout>
        </BaseDependenciesProvider>
      </>
    );
  }
}

export default DistributedTasksTablePage;
