import { Heading, majorScale, Pane } from 'evergreen-ui';
import React, { PureComponent, ReactNode } from 'react';

import { ErrorPage, RequestErrorInfo } from 'components/errors';
import { Layout, LayoutProps } from 'components/layout';
import { Link } from 'components/link';

import { RequestError, transformRequestError } from 'error-handling';

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
  dataFetchingError?: RequestError;
}

type GetInitialPropsFn = AppPageComponentType<
  CreatePageProps
>['getInitialProps'];

export default class CreatePage extends PureComponent<CreatePageProps> {
  public static getInitialProps: GetInitialPropsFn = ({
    query,
    fetch,
    redirect,
  }) => {
    const distributedTaskDefinitionId = query.distributedTaskDefinitionId as string;

    return isAuthenticated(fetch)
      .then((authenticated) => {
        if (!authenticated) {
          redirect(`${config.loginPageUrl}?unauthenticated`);
        }

        return {
          distributedTaskDefinitionId,
        };
      })
      .catch((error) => ({
        dataFetchingError: transformRequestError(error),
        distributedTaskDefinitionId,
      }));
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

              {this.renderErrors()}
              {this.renderForm()}
            </Pane>
          </Layout>
        </BaseDependenciesProvider>
      </>
    );
  }

  private renderErrors = (): ReactNode => {
    const { dataFetchingError, distributedTaskDefinitionId } = this.props;

    if (!dataFetchingError) {
      return;
    }

    return (
      <ErrorPage>
        <RequestErrorInfo error={dataFetchingError} />

        <Link
          route={`/distributed-task-definitions/${distributedTaskDefinitionId}`}
        >
          <a>Go back to the distributed task definition</a>
        </Link>
      </ErrorPage>
    );
  };

  private renderForm = (): ReactNode => {
    const { dataFetchingError, distributedTaskDefinitionId } = this.props;

    if (dataFetchingError) {
      return null;
    }

    return (
      <CreateDistributedTaskForm
        distributedTaskDefinitionId={distributedTaskDefinitionId}
      />
    );
  };
}
