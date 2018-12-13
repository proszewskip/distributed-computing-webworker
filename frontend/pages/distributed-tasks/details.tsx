import { Heading, majorScale, Pane, toaster } from 'evergreen-ui';
import { GetParams } from 'kitsu';
import { NextComponentClass } from 'next';
import { withRouter, WithRouterProps } from 'next/router';
import React, { PureComponent } from 'react';

import { Layout, LayoutProps } from 'components/layout';

import {
  AuthenticatedSidebar,
  BaseDependenciesProvider,
  Head,
  kitsuFactory,
} from 'product-specific';

import {
  DistributedTaskDetails,
  DistributedTaskDetailsInitialProps,
} from 'features/distributed-tasks/details';

import { transformRequestError } from 'error-handling';
import { DistributedTask } from 'models';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

const kitsu = kitsuFactory();

type GetInitialPropsFn = NextComponentClass<
  DistributedTaskDetailsInitialProps
>['getInitialProps'];

class DetailsPage extends PureComponent<
  DistributedTaskDetailsInitialProps & WithRouterProps
> {
  public static getInitialProps: GetInitialPropsFn = ({ query }) => {
    const id = parseInt(query.id as string, 10);

    const getParams: GetParams = {
      include: 'subtasks',
    };

    return kitsu
      .get<DistributedTask>(`distributed-task/${id}`, getParams)
      .then((jsonApiResponse) => jsonApiResponse.data as any)
      .then((data) => {
        return {
          id,
          detailsData: {
            id: data.id,
            name: data.name,
            description: data.description,
            priority: data.priority,
            'trust-level-to-complete': data['trust-level-to-complete'],
            errors: data.errors,
            status: data.status,
          },
          tableData: {
            data: data.subtasks,
            totalRecordsCount: data.subtasks.length,
          },
        };
      })
      .catch((error) => ({
        id,
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
                Distributed Task details
              </Heading>

              <DistributedTaskDetails
                {...this.props}
                onBackButtonClick={this.onBackButtonClick}
                onDeleteButtonClick={this.onDeleteButtonClick}
              />
            </Pane>
          </Layout>
        </BaseDependenciesProvider>
      </>
    );
  }

  private onDeleteButtonClick = () => {
    kitsu.delete('distributed-task', this.props.id).then(() => {
      toaster.success('The task has been deleted');
      this.props.router.back();
    });
  };

  private onBackButtonClick = () => {
    this.props.router.back();
  };
}

export default withRouter(DetailsPage);
