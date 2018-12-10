import { Heading, majorScale, Pane } from 'evergreen-ui';
import React, { PureComponent } from 'react';

import { Layout, LayoutProps } from 'components/layout';

import { CreateDistributedTaskDefinitionForm } from 'features/distributed-task-definitions/create/create';

import {
  AuthenticatedSidebar,
  BaseDependenciesProvider,
  Head,
} from 'product-specific';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

export default class CreatePage extends PureComponent {
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
