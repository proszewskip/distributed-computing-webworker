import { ServerResponse } from 'http';

import { Redirect } from './types';

/**
 * Returns a function that redirects that browser to a specific URL.
 *
 * Works only server-side.
 *
 * @param res
 * @see isomorphicRedirectFactory
 */
export const serverSideRedirectFactory = (res: ServerResponse): Redirect => (
  url,
) => {
  res.writeHead(302, {
    Location: url,
  });
  res.end();
};
