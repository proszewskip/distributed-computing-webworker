import { Heading, majorScale, Pane } from 'evergreen-ui';
import { NextStatelessComponent } from 'next';
import React from 'react';

import { Layout, LayoutProps } from 'components/layout';

import {
  AppContext,
  Head,
  isAuthenticated,
  UnauthenticatedSidebar,
} from 'product-specific';

import { LoginForm } from 'features/authentication';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <UnauthenticatedSidebar />
);

const LoginPage: NextStatelessComponent<{}, {}, AppContext> = () => (
  <>
    <Head />

    <Layout renderSidebar={renderSidebar}>
      <Pane margin={majorScale(1)}>
        <Heading size={700} marginBottom={majorScale(1)}>
          Log in
        </Heading>

        <LoginForm />
      </Pane>
    </Layout>
  </>
);

LoginPage.getInitialProps = async ({ fetch, redirect }) => {
  if (await isAuthenticated(fetch)) {
    redirect('/');
  }

  return {};
};

export default LoginPage;
