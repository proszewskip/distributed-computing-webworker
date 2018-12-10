import { Heading, Link, majorScale, Pane } from 'evergreen-ui';
import { NextComponentClass } from 'next';
import { withRouter, WithRouterProps } from 'next/router';
import React, { PureComponent, ReactNode } from 'react';

import { ErrorPage, RequestErrorInfo } from 'components/errors';
import { Layout, LayoutProps } from 'components/layout';

import { RequestError, transformRequestError } from 'error-handling';
import {
  AuthenticatedSidebar,
  BaseDependenciesProvider,
  Head,
  kitsuFactory,
} from 'product-specific';

import { UpdateDistributedTaskModel } from 'features/distributed-tasks/update/types';
import { UpdateDistributedTaskForm } from 'features/distributed-tasks/update/update';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

const kitsu = kitsuFactory();

export interface UpdatePageProps {
  id: number;
  errors?: RequestError;
  data?: UpdateDistributedTaskModel;
}

type GetInitialPropsFn = NextComponentClass<UpdatePageProps>['getInitialProps'];

class UpdatePage extends PureComponent<UpdatePageProps & WithRouterProps> {
  public static getInitialProps: GetInitialPropsFn = ({ query }) => {
    const id = parseInt(query.id as string, 10);

    return kitsu
      .get<UpdateDistributedTaskModel>(`distributed-task/${id}`)
      .then((jsonApiResponse) => ({
        data: {
          description: jsonApiResponse.data.description,
          id: jsonApiResponse.data.id,
          name: jsonApiResponse.data.name,
          priority: jsonApiResponse.data.priority,
          'trust-level-to-complete':
            jsonApiResponse.data['trust-level-to-complete'],
        },
        id,
      }))
      .catch((error) => ({
        id,
        error: transformRequestError(error),
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
    const { data } = this.props;

    if (!data) {
      return null;
    }

    return <UpdateDistributedTaskForm data={data} />;
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
