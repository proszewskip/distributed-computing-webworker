import { Heading, majorScale, Pane } from 'evergreen-ui';
import { NextComponentClass } from 'next';
import React, { PureComponent } from 'react';

import { Layout, LayoutProps } from 'components/layout';

import { CreateDistributedTaskForm } from 'features/distributed-tasks';

import {
  AuthenticatedSidebar,
  BaseDependenciesProvider,
  Head,
} from 'product-specific';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

export interface CreatePageProps {
  id: string;
}

type GetInitialPropsFn = NextComponentClass<CreatePageProps>['getInitialProps'];

export default class CreatePage extends PureComponent<CreatePageProps> {
  public static getInitialProps: GetInitialPropsFn = ({ query }) => {
    return { id: query.id as string };
  };

  public render() {
    return (
      <>
        <Head />

        <BaseDependenciesProvider>
          <Layout renderSidebar={renderSidebar}>
            <Pane margin={majorScale(1)}>
              <Heading size={700} marginBottom={majorScale(1)}>
                Create Distributed Task
              </Heading>
              <CreateDistributedTaskForm id={this.props.id} />
            </Pane>
          </Layout>
        </BaseDependenciesProvider>
      </>
    );
  }
}
