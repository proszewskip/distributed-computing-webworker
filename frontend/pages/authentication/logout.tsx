import fetch from 'isomorphic-unfetch';
import { NextComponentType } from 'next';
import React from 'react';

import { redirectToLoginPage } from 'features/authentication';

import { config } from 'product-specific';

import { routes } from '../../routes';

const LogoutPage: NextComponentType = () => {
  return <div>Logging out...</div>;
};

LogoutPage.getInitialProps = async ({ res }) => {
  try {
    await fetch(`${config.serverUrl}/users/logout`, { method: 'POST' });
  } catch (error) {
    // NOOP
  }

  redirectToLoginPage({ res, router: routes.Router })();

  return {};
};

export default LogoutPage;
