import { clientSideRedirectFactory } from './client-side-redirect-factory';
import { serverSideRedirectFactory } from './server-side-redirect-factory';
import { IsomorphicRedirectFactoryParams, Redirect } from './types';

/**
 * A factory that provides functions that when called, redirect the browser to a specific URL.
 *
 * The returned function works both client-side and server-side.
 */
export const isomorphicRedirectFactory = ({
  res,
  router,
}: IsomorphicRedirectFactoryParams): Redirect =>
  res ? serverSideRedirectFactory(res) : clientSideRedirectFactory(router);
