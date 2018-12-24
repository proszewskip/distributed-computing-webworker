import { Heading, majorScale, Pane } from 'evergreen-ui';
import React, { PureComponent } from 'react';

import { Layout, LayoutProps } from 'components/layout';

import { CreateDistributedTaskDefinitionForm } from 'features/distributed-task-definitions/create';

import {
  AppContext,
  AuthenticatedSidebar,
  BaseDependenciesProvider,
  config,
  Head,
  isAuthenticated,
} from 'product-specific';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

export default class CreatePage extends PureComponent {
  public static getInitialProps = async ({ fetch, redirect }: AppContext) => {
    if (!(await isAuthenticated(fetch))) {
      redirect(`${config.loginPageUrl}?unauthenticated`);
    }

    return {};
  };

  public render() {
    return (
      <>
        <Head />

        <BaseDependenciesProvider>
          <Layout renderSidebar={renderSidebar}>
            <Pane margin={majorScale(1)}>
              <Heading size={700} marginBottom={majorScale(1)}>
                Create Distributed Task Definition
              </Heading>
              <CreateDistributedTaskDefinitionForm />
            </Pane>
          </Layout>
        </BaseDependenciesProvider>
      </>
    );
  }
}
