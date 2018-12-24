import { Router } from 'next-routes';

import { Redirect } from './types';

export const clientSideRedirectFactory = (router: Router): Redirect => (
  url,
) => {
  router.pushRoute(url);
};
