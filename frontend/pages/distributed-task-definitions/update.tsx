import { Heading, Link, majorScale, Pane } from 'evergreen-ui';
import { NextComponentClass } from 'next';
import { withRouter, WithRouterProps } from 'next/router';
import React, { PureComponent, ReactNode } from 'react';

import { ErrorPage, RequestErrorInfo } from 'components/errors';
import { Layout, LayoutProps } from 'components/layout';

import {
  UpdateDistributedTaskDefinitionForm,
  UpdateDistributedTaskDefinitionModel,
} from 'features/distributed-task-definitions/update';

import { RequestError, transformRequestError } from 'error-handling';
import {
  AuthenticatedSidebar,
  BaseDependenciesProvider,
  Head,
  kitsuFactory,
} from 'product-specific';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

export interface UpdatePageProps {
  errors?: RequestError;
  data?: UpdateDistributedTaskDefinitionModel;
}

type GetInitialPropsFn = NextComponentClass<UpdatePageProps>['getInitialProps'];

class UpdatePage extends PureComponent<UpdatePageProps & WithRouterProps> {
  public static getInitialProps: GetInitialPropsFn = ({ query }) => {
    const kitsu = kitsuFactory();

    const id = parseInt(query.id as string, 10);

    return kitsu
      .get<UpdateDistributedTaskDefinitionModel>(
        `distributed-task-definition/${id}`,
      )
      .then((jsonApiResponse) => ({
        data: {
          description: jsonApiResponse.data.description,
          id: jsonApiResponse.data.id,
          name: jsonApiResponse.data.name,
        },
      }))
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
    const { data } = this.props;

    if (!data) {
      return null;
    }

    return <UpdateDistributedTaskDefinitionForm data={data} />;
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
