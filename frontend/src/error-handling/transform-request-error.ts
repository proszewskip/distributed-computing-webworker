import { isJsonApiErrorResponse, isNativeError } from './type-guards';
import { RequestError } from './types';

export function transformRequestError(error: unknown): RequestError {
  if (isJsonApiErrorResponse(error)) {
    return error.errors;
  }

  if (isNativeError(error)) {
    return error;
  }

  return new Error('Unknown error');
}
