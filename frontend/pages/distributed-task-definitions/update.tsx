import { Heading, Link, majorScale, Pane } from 'evergreen-ui';
import { NextComponentClass } from 'next';
import React, { PureComponent, ReactNode } from 'react';

import { ErrorPage, RequestErrorInfo } from 'components/errors';
import { Layout, LayoutProps } from 'components/layout';
import { withRouter, WithRouterProps } from 'components/router';

import {
  handleAuthenticationErrorFactory,
  redirectToLoginPage,
} from 'features/authentication';
import {
  UpdateDistributedTaskDefinitionForm,
  UpdateDistributedTaskDefinitionModel,
} from 'features/distributed-task-definitions/update';

import { RequestError, transformRequestError } from 'error-handling';
import {
  AuthenticatedSidebar,
  BaseDependenciesProvider,
  Head,
  isomorphicGetBaseUrl,
  kitsuFactory,
} from 'product-specific';

import { routes } from '../../routes';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

export interface UpdatePageProps {
  errors?: RequestError;
  modelData?: UpdateDistributedTaskDefinitionModel;
}

type GetInitialPropsFn = NextComponentClass<UpdatePageProps>['getInitialProps'];

class UpdatePage extends PureComponent<UpdatePageProps & WithRouterProps> {
  public static getInitialProps: GetInitialPropsFn = ({ query, req, res }) => {
    const kitsu = kitsuFactory({
      baseURL: isomorphicGetBaseUrl(req),
    });

    const id = parseInt(query.id as string, 10);

    const handleAuthenticationError = handleAuthenticationErrorFactory<
      UpdatePageProps
    >(redirectToLoginPage({ res, router: routes.Router }));

    return kitsu
      .get<UpdateDistributedTaskDefinitionModel>(
        `distributed-task-definition/${id}`,
      )
      .then(
        (jsonApiResponse) =>
          jsonApiResponse.data as UpdateDistributedTaskDefinitionModel,
      )
      .then(
        (data): UpdatePageProps => ({
          modelData: {
            description: data.description,
            id: data.id,
            name: data.name,
          },
        }),
      )
      .catch(handleAuthenticationError)
      .catch((error) => ({
        errors: transformRequestError(error),
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
                Update Distributed Task Definition
              </Heading>
              {this.renderErrors()}
              {this.renderForm()}
            </Pane>
          </Layout>
        </BaseDependenciesProvider>
      </>
    );
  }

  private renderForm = (): ReactNode => {
    const { modelData } = this.props;

    if (!modelData) {
      return null;
    }

    return <UpdateDistributedTaskDefinitionForm data={modelData} />;
  };

  private renderErrors = (): ReactNode => {
    const { errors } = this.props;

    if (!errors) {
      return null;
    }

    return (
      <ErrorPage>
        <RequestErrorInfo error={errors} />

        <Link route="/distributed-task-definitions">
          <a>Go back to the list of distributed task definitions</a>
        </Link>
      </ErrorPage>
    );
  };
}

export default withRouter(UpdatePage);
