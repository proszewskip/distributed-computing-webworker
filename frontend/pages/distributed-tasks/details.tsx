import { Heading, majorScale, Pane } from 'evergreen-ui';
import { NextContext } from 'next';
import React, { PureComponent } from 'react';

import { Layout, LayoutProps } from 'components/layout';
import { withRouter, WithRouterProps } from 'components/router';

import {
  AuthenticatedSidebar,
  BaseDependenciesProvider,
  Head,
  isomorphicGetBaseUrl,
  kitsuFactory,
} from 'product-specific';

import {
  DistributedTaskDetails,
  DistributedTaskDetailsProps,
  getDistributedTaskDetailsInitialProps,
} from 'features/distributed-tasks/details';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

class DetailsPage extends PureComponent<
  DistributedTaskDetailsProps & WithRouterProps
> {
  public static getInitialProps = (context: NextContext) =>
    getDistributedTaskDetailsInitialProps(
      kitsuFactory({
        baseURL: isomorphicGetBaseUrl(context.req),
      }),
    )(context);

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

              <DistributedTaskDetails {...this.props} />
            </Pane>
          </Layout>
        </BaseDependenciesProvider>
      </>
    );
  }
}

export default withRouter(DetailsPage);
