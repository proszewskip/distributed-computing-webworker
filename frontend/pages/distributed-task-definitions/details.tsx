import { Heading, majorScale, Pane } from 'evergreen-ui';
import React, { PureComponent } from 'react';

import { Layout, LayoutProps } from 'components/layout';
import { withRouter, WithRouterProps } from 'components/router';

import {
  DistributedTaskDefinitionDetails,
  getDistributedTaskDefinitionDetailsInitialProps,
} from 'features/distributed-task-definitions';
import { DistributedTaskDefinitionDetailsOwnProps } from 'features/distributed-task-definitions/details/types';

import {
  AppContext,
  AuthenticatedSidebar,
  BaseDependenciesProvider,
  Head,
} from 'product-specific';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

class DetailsPage extends PureComponent<
  DistributedTaskDefinitionDetailsOwnProps & WithRouterProps
> {
  public static getInitialProps = (context: AppContext) => {
    const kitsu = context.kitsuFactory();

    return getDistributedTaskDefinitionDetailsInitialProps(kitsu)(context);
  };

  public render() {
    return (
      <>
        <Head />

        <BaseDependenciesProvider>
          <Layout renderSidebar={renderSidebar}>
            <Pane margin={majorScale(1)}>
              <Heading size={700} marginBottom={majorScale(1)}>
                Distributed Task Definition details
              </Heading>

              <DistributedTaskDefinitionDetails {...this.props} />
            </Pane>
          </Layout>
        </BaseDependenciesProvider>
      </>
    );
  }
}

export default withRouter(DetailsPage);
