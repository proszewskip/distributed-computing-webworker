import { isJsonApiErrorResponse } from 'error-handling';

export const handleAuthenticationErrorFactory = <Props>(
  redirect: () => void,
  fallbackProps: Props,
) => (error: unknown) => {
  if (isJsonApiErrorResponse(error)) {
    const isForbidden = error.errors.find(
      (singleError) => singleError.status === '403',
    );

    if (isForbidden) {
      redirect();
    } else {
      return Promise.reject<Props>(error);
    }
  }

  /**
   * TODO: handle `fetch` responses
   */

  return fallbackProps;
};
