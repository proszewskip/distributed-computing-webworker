import { ServerResponse } from 'http';
import { Router } from 'next-routes';

/**
 * Redirect the user to a specific URL, regardless of whether the environment
 * is the server or the client.
 *
 * @param url
 */
export type Redirect = (url: string) => void;

export interface IsomorphicRedirectFactoryParams {
  res?: ServerResponse;
  router: Router;
}
