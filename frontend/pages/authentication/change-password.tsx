import { Heading, majorScale, Pane } from 'evergreen-ui';
import React, { PureComponent } from 'react';

import { Layout, LayoutProps } from 'components/layout';

import {
  AppContext,
  AuthenticatedSidebar,
  BaseDependenciesProvider,
  config,
  Head,
  isAuthenticated,
} from 'product-specific';

import { ChangePasswordForm } from 'features/authentication';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

export default class ChangePasswordPage extends PureComponent {
  public static getInitialProps = async ({ fetch, redirect }: AppContext) => {
    if (!(await isAuthenticated(fetch))) {
      redirect(`${config.loginPageUrl}?unauthenticated`);
    }

    return {};
  };

  public render() {
    return (
      <>
        <Head />

        <BaseDependenciesProvider>
          <Layout renderSidebar={renderSidebar}>
            <Pane margin={majorScale(1)}>
              <Heading size={700} marginBottom={majorScale(1)}>
                Change password
              </Heading>
              <ChangePasswordForm />
            </Pane>
          </Layout>
        </BaseDependenciesProvider>
      </>
    );
  }
}
