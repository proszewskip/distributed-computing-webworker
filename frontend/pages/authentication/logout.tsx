import { NextStatelessComponent } from 'next';
import React from 'react';

import { AppContext, config, logout } from 'product-specific';

const LogoutPage: NextStatelessComponent<{}, {}, AppContext> = () => {
  return <div>Logging out...</div>;
};

LogoutPage.getInitialProps = async ({
  redirect,
  fetch,
  res: nextjsResponse,
}) => {
  const logoutResponse = await logout(fetch);

  if (logoutResponse && nextjsResponse) {
    const headerName = 'set-cookie';

    /**
     * NOTE: forward headers so that the client logs out properly even when
     * next.js makes the request
     */
    nextjsResponse.setHeader(headerName, logoutResponse.headers.get(
      headerName,
    ) as string);
  }

  // TODO: add a query param that the logout has been successful
  redirect(config.loginPageUrl);

  return {};
};

export default LogoutPage;
