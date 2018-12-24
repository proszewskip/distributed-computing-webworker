import { Heading, majorScale, Pane } from 'evergreen-ui';
import React, { PureComponent } from 'react';

import { Layout, LayoutProps } from 'components/layout';

import { CreateDistributedTaskForm } from 'features/distributed-tasks';

import {
  AppPageComponentType,
  AuthenticatedSidebar,
  BaseDependenciesProvider,
  config,
  Head,
  isAuthenticated,
} from 'product-specific';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

export interface CreatePageProps {
  distributedTaskDefinitionId: string;
}

type GetInitialPropsFn = AppPageComponentType<
  CreatePageProps
>['getInitialProps'];

export default class CreatePage extends PureComponent<CreatePageProps> {
  public static getInitialProps: GetInitialPropsFn = async ({
    query,
    fetch,
    redirect,
  }) => {
    if (!(await isAuthenticated(fetch))) {
      // TODO: add a query param that the user has been logged out
      redirect(config.loginPageUrl);
    }

    return {
      distributedTaskDefinitionId: query.distributedTaskDefinitionId as string,
    };
  };

  public render() {
    const { distributedTaskDefinitionId } = this.props;

    return (
      <>
        <Head />

        <BaseDependenciesProvider>
          <Layout renderSidebar={renderSidebar}>
            <Pane margin={majorScale(1)}>
              <Heading size={700} marginBottom={majorScale(1)}>
                Create Distributed Task
              </Heading>
              <CreateDistributedTaskForm
                distributedTaskDefinitionId={distributedTaskDefinitionId}
              />
            </Pane>
          </Layout>
        </BaseDependenciesProvider>
      </>
    );
  }
}
