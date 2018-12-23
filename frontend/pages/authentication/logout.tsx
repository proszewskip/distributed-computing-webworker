import { NextStatelessComponent } from 'next';
import React from 'react';

import { AppContext, logout } from 'product-specific';

const LogoutPage: NextStatelessComponent<{}, {}, AppContext> = () => {
  return <div>Logging out...</div>;
};

LogoutPage.getInitialProps = async ({
  redirectToLoginPage,
  fetch,
  res: nextjsResponse,
}) => {
  const logoutResponse = await logout(fetch);

  if (logoutResponse && nextjsResponse) {
    const headerName = 'set-cookie';

    console.log(logoutResponse.headers);
    nextjsResponse.setHeader(headerName, logoutResponse.headers.get(
      headerName,
    ) as string);
  }

  redirectToLoginPage();

  return {};
};

export default LogoutPage;
