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

  redirect(`${config.loginPageUrl}?logout-successful`);

  return {};
};

export default LogoutPage;
