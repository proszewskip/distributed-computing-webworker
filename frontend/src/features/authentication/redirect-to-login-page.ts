import { ServerResponse } from 'http';
import { Router } from 'next-routes';

const serverSideRedirect = (res: ServerResponse) => (url: string) => {
  res.writeHead(302, {
    Location: url,
  });
  res.end();
};

const clientSideRedirect = (router: Router) => (url: string) => {
  router.pushRoute(url);
};

export const isomorphicRedirect = (url: string) => ({
  res,
  router,
}: {
  res?: ServerResponse;
  router: Router;
}) => () => {
  const redirect = res ? serverSideRedirect(res) : clientSideRedirect(router);

  return redirect(url);
};

// NOTE: add some query parameter so that the login page displays that the user has been
// logged out.
const loginPageUrl = '/authentication/login';

export const redirectToLoginPage = isomorphicRedirect(loginPageUrl);
