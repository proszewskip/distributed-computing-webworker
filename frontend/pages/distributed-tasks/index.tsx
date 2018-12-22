import { majorScale, Pane } from 'evergreen-ui';
import { NextComponentType } from 'next';
import React, { Component } from 'react';

import { Layout, LayoutProps } from 'components/layout';

import {
  AuthenticatedSidebar,
  BaseDependenciesProvider,
  Head,
  isomorphicGetBaseUrl,
  kitsuFactory,
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
  public static getInitialProps: NextComponentType<
    DistributedTasksTablePageProps
  >['getInitialProps'] = ({ req }) =>
    fetchDistributedTasksWithDefinitions(
      kitsuFactory({
        baseURL: isomorphicGetBaseUrl(req),
      }),
    );

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
