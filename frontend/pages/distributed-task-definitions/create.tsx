import { Heading, majorScale, Pane } from 'evergreen-ui';
import React, { PureComponent, ReactNode } from 'react';

import { ErrorPage, RequestErrorInfo } from 'components/errors';
import { Layout, LayoutProps } from 'components/layout';
import { Link } from 'components/link';

import { CreateDistributedTaskDefinitionForm } from 'features/distributed-task-definitions/create';

import { RequestError, transformRequestError } from 'error-handling';

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

interface CreatePageProps {
  dataFetchingError?: RequestError;
}

export default class CreatePage extends PureComponent<CreatePageProps> {
  public static getInitialProps = ({
    fetch,
    redirect,
  }: AppContext): Promise<CreatePageProps> => {
    return isAuthenticated(fetch)
      .then((authenticated) => {
        if (!authenticated) {
          redirect(`${config.loginPageUrl}?unauthenticated`);
        }

        return {};
      })
      .catch((error) => ({
        dataFetchingError: transformRequestError(error),
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
                Create Distributed Task Definition
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
    const { dataFetchingError } = this.props;

    if (!dataFetchingError) {
      return;
    }

    return (
      <ErrorPage>
        <RequestErrorInfo error={dataFetchingError} />

        <Link route="/distributed-task-definitions">
          <a>Go back to the list of distributed task definitions</a>
        </Link>
      </ErrorPage>
    );
  };

  private renderForm = (): ReactNode => {
    const { dataFetchingError } = this.props;

    if (dataFetchingError) {
      return null;
    }

    return <CreateDistributedTaskDefinitionForm />;
  };
}
