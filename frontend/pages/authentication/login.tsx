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
import {
  LogoutSuccessful,
  Unauthenticated,
} from 'features/authentication/login-redirect-reasons';

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <UnauthenticatedSidebar />
);

interface LoginPageProps {
  additionalInfo?: 'logout-successful' | 'unauthenticated';
}

const LoginPage: NextStatelessComponent<
  LoginPageProps,
  LoginPageProps,
  AppContext
> = ({ additionalInfo }) => (
  <>
    <Head />

    <Layout renderSidebar={renderSidebar}>
      <Pane margin={majorScale(1)}>
        <Heading size={700} marginBottom={majorScale(1)}>
          Log in
        </Heading>

        {additionalInfo === 'unauthenticated' && <Unauthenticated />}
        {additionalInfo === 'logout-successful' && <LogoutSuccessful />}

        <LoginForm />
      </Pane>
    </Layout>
  </>
);

LoginPage.getInitialProps = async ({
  fetch,
  redirect,
  query,
}): Promise<LoginPageProps> => {
  if (await isAuthenticated(fetch)) {
    redirect('/');
  }

  if (query.unauthenticated !== undefined) {
    return {
      additionalInfo: 'unauthenticated',
    };
  } else if (query['logout-successful'] !== undefined) {
    return {
      additionalInfo: 'logout-successful',
    };
  }

  return {};
};

export default LoginPage;
