import { isJsonApiErrorResponse, isNativeError } from './type-guards';
import { RequestError } from './types';

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

  return {
    type: 'nativeError',
    name: 'Unknown error',
    message: 'An unexpected error occurred',
  };
}
