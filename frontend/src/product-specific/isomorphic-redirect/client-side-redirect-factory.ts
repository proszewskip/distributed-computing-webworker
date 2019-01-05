import { Router } from 'next-routes';

import { Redirect } from './types';

/**
 * Returns a function that redirects the browser to a specific URL.
 *
 * Works only client-side.
 *
 * @param router
 * @see isomorphicRedirectFactory
 */
export const clientSideRedirectFactory = (router: Router): Redirect => (
  url,
) => {
  router.pushRoute(url);
};
