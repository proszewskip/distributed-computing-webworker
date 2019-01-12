import { JsonApiErrorResponse } from 'kitsu';

import {
  handleAuthenticationErrorFactory,
  HandleAuthenticationErrorFn,
} from './handle-authentication-error';

describe('handleAuthentiationError', () => {
  let redirect: jest.Mock;
  let handleAuthenticationError: HandleAuthenticationErrorFn<any>;

  beforeEach(() => {
    redirect = jest.fn();
    handleAuthenticationError = handleAuthenticationErrorFactory(redirect);
  });

  it('should redirect to the login page when there is an authentication error', async () => {
    const error: JsonApiErrorResponse = {
      errors: [
        {
          status: '403',
        },
      ],
    };

    try {
      await handleAuthenticationError(error);
    } catch (_) {
      // NOTE: intentional noop
    }

    expect(redirect).toHaveBeenCalled();
  });

  it('should not redirect anywhere when the error is not authentication-related one', async () => {
    const error = new Error();

    try {
      await handleAuthenticationError(error);
    } catch (_) {
      // NOTE: intentional noop
    }

    expect(redirect).not.toHaveBeenCalled();
  });

  it('should rethrow the original error', async () => {
    const error = new Error();

    try {
      await handleAuthenticationError(error);
    } catch (caughtError) {
      expect(caughtError).toBe(error);
    }
  });
});
