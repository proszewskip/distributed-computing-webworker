import { clientSideRedirectFactory } from './client-side-redirect-factory';
import { serverSideRedirectFactory } from './server-side-redirect-factory';
import { IsomorphicRedirectFactoryParams, Redirect } from './types';

export const isomorphicRedirectFactory = ({
  res,
  router,
}: IsomorphicRedirectFactoryParams): Redirect =>
  res ? serverSideRedirectFactory(res) : clientSideRedirectFactory(router);
