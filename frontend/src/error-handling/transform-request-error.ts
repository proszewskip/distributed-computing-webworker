import { isJsonApiErrorResponse, isNativeError } from './type-guards';
import { RequestError } from './types';

/**
 * Transforms any request error into an internal error representation.
 *
 * @param error
 */
export function transformRequestError(error: unknown): RequestError {
  if (isJsonApiErrorResponse(error)) {
    return {
      type: 'jsonApiErrors',
      errors: error.errors,
    };
  }

  if (isNativeError(error)) {
    return {
      type: 'nativeError',
      name: error.name,
      message: error.message,
    };
  }

  if (typeof error === 'string') {
    return {
      type: 'nativeError',
      name: 'Unknown error',
      message: error,
    };
  }

  return {
    type: 'nativeError',
    name: 'Unknown error',
    message: 'An unexpected error occurred',
  };
}
