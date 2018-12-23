import { Heading, majorScale, Pane } from 'evergreen-ui';
import React, { PureComponent } from 'react';

import { Layout, LayoutProps } from 'components/layout';
import { withRouter, WithRouterProps } from 'components/router';

import {
  AppContext,
  AuthenticatedSidebar,
  BaseDependenciesProvider,
  Head,
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
  public static getInitialProps = (context: AppContext) => {
    const kitsu = context.kitsuFactory();

    return getDistributedTaskDetailsInitialProps(kitsu)(context);
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

              <DistributedTaskDetails {...this.props} />
            </Pane>
          </Layout>
        </BaseDependenciesProvider>
      </>
    );
  }
}

export default withRouter(DetailsPage);
