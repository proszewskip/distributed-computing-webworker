import { Heading, Link, majorScale, Pane } from 'evergreen-ui';
import { NextComponentClass } from 'next';
import React, { PureComponent, ReactNode } from 'react';

import { ErrorPage, RequestErrorInfo } from 'components/errors';
import { Layout, LayoutProps } from 'components/layout';
import { withRouter, WithRouterProps } from 'components/router';

import { RequestError, transformRequestError } from 'error-handling';

import {
  handleAuthenticationErrorFactory,
  redirectToLoginPage,
} from 'features/authentication';
import {
  UpdateDistributedTaskForm,
  UpdateDistributedTaskModel,
} from 'features/distributed-tasks/update';

import {
  AuthenticatedSidebar,
  BaseDependenciesProvider,
  Head,
  kitsuFactory,
} from 'product-specific';

import { routes } from '../../routes';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

export interface UpdatePageProps {
  errors?: RequestError;
  modelData?: UpdateDistributedTaskModel;
}

type GetInitialPropsFn = NextComponentClass<UpdatePageProps>['getInitialProps'];

class UpdatePage extends PureComponent<UpdatePageProps & WithRouterProps> {
  public static getInitialProps: GetInitialPropsFn = ({ query, res }) => {
    const kitsu = kitsuFactory();

    const id = parseInt(query.id as string, 10);

    const handleAuthenticationError = handleAuthenticationErrorFactory<
      UpdatePageProps
    >(redirectToLoginPage({ res, router: routes.Router }));

    return kitsu
      .get<UpdateDistributedTaskModel>(`distributed-task/${id}`)
      .then(
        (jsonApiResponse) => jsonApiResponse.data as UpdateDistributedTaskModel,
      )
      .then(
        (data): UpdatePageProps => ({
          modelData: {
            description: data.description,
            id: data.id,
            name: data.name,
            priority: data.priority,
            'trust-level-to-complete': data['trust-level-to-complete'],
          },
        }),
      )
      .catch(handleAuthenticationError)
      .catch(
        (error): UpdatePageProps => ({
          errors: transformRequestError(error),
        }),
      );
  };

  public render() {
    return (
      <>
        <Head />

        <BaseDependenciesProvider>
          <Layout renderSidebar={renderSidebar}>
            <Pane margin={majorScale(1)}>
              <Heading size={700} marginBottom={majorScale(1)}>
                Update Distributed Task
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

    return <UpdateDistributedTaskForm data={modelData} />;
  };

  private renderErrors = (): ReactNode => {
    const { errors } = this.props;

    if (!errors) {
      return null;
    }

    return (
      <ErrorPage>
        <RequestErrorInfo error={errors} />

        <Link route="/distributed-tasks">
          <a>Go back to the list of distributed tasks</a>
        </Link>
      </ErrorPage>
    );
  };
}

export default withRouter(UpdatePage);
