import { majorScale, Pane } from 'evergreen-ui';
import React, { Component } from 'react';

import { Layout, LayoutProps } from 'components/layout';

import {
  DistributedTaskDefinitionsTable,
  DistributedTaskDefinitionsTableOwnProps,
  getDistributedTaskDefinitionsTableInitialProps,
} from 'features/distributed-task-definitions/table';

import {
  AuthenticatedSidebar,
  BaseDependenciesProvider,
  Head,
  kitsuFactory,
} from 'product-specific';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

type DistributedTaskDefinitionsTablePageInitialProps = DistributedTaskDefinitionsTableOwnProps;

class DistributedTaskDefinitionsTablePage extends Component<
  DistributedTaskDefinitionsTablePageInitialProps
> {
  public static getInitialProps = getDistributedTaskDefinitionsTableInitialProps(
    kitsuFactory(),
  );

  public render() {
    return (
      <>
        <Head />

        <BaseDependenciesProvider>
          <Layout renderSidebar={renderSidebar}>
            <Pane margin={majorScale(1)}>
              <DistributedTaskDefinitionsTable {...this.props} />
            </Pane>
          </Layout>
        </BaseDependenciesProvider>
      </>
    );
  }
}

export default DistributedTaskDefinitionsTablePage;
