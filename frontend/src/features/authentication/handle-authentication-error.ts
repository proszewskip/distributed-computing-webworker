import { isJsonApiErrorResponse } from 'error-handling';

/**
 * Handles JSON API errors that resulted from the user being unauthenticated.
 *
 * @param redirect Function to be called if the user should be redirected
 * @param fallbackProps Fallback props that will be used
 */
export const handleAuthenticationErrorFactory = <Props>(
  redirect: () => void,
) => (error: unknown) => {
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

  return Promise.reject<Props>(error);
};
