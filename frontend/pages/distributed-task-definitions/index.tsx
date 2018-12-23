import { majorScale, Pane } from 'evergreen-ui';
import React, { Component } from 'react';

import { Layout, LayoutProps } from 'components/layout';

import {
  DistributedTaskDefinitionsTable,
  DistributedTaskDefinitionsTableOwnProps,
  getDistributedTaskDefinitionsTableInitialProps,
} from 'features/distributed-task-definitions/table';

import {
  AppContext,
  AuthenticatedSidebar,
  BaseDependenciesProvider,
  Head,
} from 'product-specific';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

type DistributedTaskDefinitionsTablePageInitialProps = DistributedTaskDefinitionsTableOwnProps;

class DistributedTaskDefinitionsTablePage extends Component<
  DistributedTaskDefinitionsTablePageInitialProps
> {
  public static getInitialProps = (context: AppContext) => {
    const kitsu = context.kitsuFactory();

    return getDistributedTaskDefinitionsTableInitialProps(kitsu)(context);
  };

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
