import { isJsonApiErrorResponse } from 'error-handling';

export type HandleAuthenticationErrorFn<Props> = (
  error: unknown,
) => Promise<Props>;

/**
 * Handles JSON API errors that resulted from the user being unauthenticated.
 *
 * Treat this function as middleware, as it **rethrows the original error**.
 *
 * @param redirect Function to be called if the user should be redirected
 */
export const handleAuthenticationErrorFactory = <Props>(
  redirect: () => void,
): HandleAuthenticationErrorFn<Props> => (error) => {
  if (isJsonApiErrorResponse(error)) {
    const isForbidden = error.errors.find(
      (singleError) => singleError.status === '403',
    );

    if (isForbidden) {
      redirect();
    }
  }

  /**
   * TODO: handle `fetch` responses
   */

  return Promise.reject(error);
};
