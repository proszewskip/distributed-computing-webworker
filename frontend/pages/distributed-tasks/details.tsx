import { Heading, majorScale, Pane } from 'evergreen-ui';
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
  DistributedTaskDetailsProps,
  getDistributedTaskDetailsInitialProps,
} from 'features/distributed-tasks/details';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

class DetailsPage extends PureComponent<
  DistributedTaskDetailsProps & WithRouterProps
> {
  public static getInitialProps = getDistributedTaskDetailsInitialProps(
    kitsuFactory(),
  );

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
