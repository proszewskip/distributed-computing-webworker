import React, { Component } from 'react';

import { DependencyInjectionEnhancer } from 'components/dependency-injection/enhancer';
import { Layout, LayoutProps } from 'components/layout';

import {
  AppContext,
  AuthenticatedSidebar,
  BaseDependenciesProvider,
  Head,
  isAuthenticated,
  UnauthenticatedSidebar,
} from 'product-specific';

import {
  dependenciesEnhancer as workerControllerDependenciesEnhancer,
  WorkerController,
} from 'features/worker/components';

interface WorkerPageProps {
  isAuthenticated: boolean;
}

const renderAuthenticatedSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

const renderUnauthenticatedSidebar: LayoutProps['renderSidebar'] = () => (
  <UnauthenticatedSidebar />
);

class WorkerPage extends Component<WorkerPageProps> {
  public static getInitialProps = ({ fetch }: AppContext) => {
    return isAuthenticated(fetch).then(
      (authenticated): WorkerPageProps => ({
        isAuthenticated: authenticated,
      }),
    );
  };

  public render() {
    const renderSidebar = this.props.isAuthenticated
      ? renderAuthenticatedSidebar
      : renderUnauthenticatedSidebar;

    return (
      <>
        <Head />

        <BaseDependenciesProvider>
          <DependencyInjectionEnhancer
            enhanceDependencies={workerControllerDependenciesEnhancer}
          >
            <Layout renderSidebar={renderSidebar}>
              <WorkerController />
            </Layout>
          </DependencyInjectionEnhancer>
        </BaseDependenciesProvider>
      </>
    );
  }
}

export default WorkerPage;
