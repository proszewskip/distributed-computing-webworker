import { Heading, majorScale, Pane } from 'evergreen-ui';
import { withRouter, WithRouterProps } from 'next/router';
import React, { PureComponent } from 'react';

import { Layout, LayoutProps } from 'components/layout';

import {
  DistributedTaskDefinitionDetails,
  getDistributedTaskDefinitionDetailsInitialProps,
} from 'features/distributed-task-definitions';
import { DistributedTaskDefinitionDetailsInitialProps } from 'features/distributed-task-definitions/details/types';

import {
  AuthenticatedSidebar,
  BaseDependenciesProvider,
  Head,
  kitsuFactory,
} from 'product-specific';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

const kitsu = kitsuFactory();

class DetailsPage extends PureComponent<
  DistributedTaskDefinitionDetailsInitialProps & WithRouterProps
> {
  public static getInitialProps = getDistributedTaskDefinitionDetailsInitialProps(
    kitsu,
  );

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
