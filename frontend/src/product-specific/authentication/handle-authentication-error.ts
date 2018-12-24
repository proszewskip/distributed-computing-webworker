import { isJsonApiErrorResponse } from 'error-handling';

import { config } from 'product-specific/config';
import { Redirect } from 'product-specific/isomorphic-redirect';

/**
 * Handles JSON API errors that resulted from the user being unauthenticated.
 *
 * Treat this function as middleware, as it **rethrows the original error**.
 */
export type HandleAuthenticationErrorFn<Props> = (
  error: unknown,
) => Promise<Props>;

/**
 * @param redirect Function to be called if the user should be redirected
 */
export const handleAuthenticationErrorFactory = <Props>(
  redirect: Redirect,
): HandleAuthenticationErrorFn<Props> => (error) => {
  if (isJsonApiErrorResponse(error)) {
    const isForbidden = error.errors.find(
      (singleError) => singleError.status === '403',
    );

    if (isForbidden) {
      // TODO: add a query param that the user has been logged out
      redirect(config.loginPageUrl);
    }
  }

  /**
   * TODO: handle `fetch` responses
   */

  return Promise.reject(error);
};
