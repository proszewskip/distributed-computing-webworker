import fetch from 'isomorphic-unfetch';
import { NextComponentType } from 'next';
import React from 'react';

import { logout, redirectToLoginPage } from 'features/authentication';

import { routes } from '../../routes';

const LogoutPage: NextComponentType = () => {
  return <div>Logging out...</div>;
};

LogoutPage.getInitialProps = async ({ res }) => {
  await logout(fetch);

  redirectToLoginPage({ res, router: routes.Router })();

  return {};
};

export default LogoutPage;
