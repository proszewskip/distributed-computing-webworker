import { JsonApiErrorResponse } from 'kitsu';
import { JsonApiErrors, NativeError } from './types';

export function isJsonApiErrorResponse(
  error: unknown,
): error is JsonApiErrorResponse {
  return !!(error as JsonApiErrorResponse).errors;
}

export function areJsonApiErrors(errors: unknown): errors is JsonApiErrors {
  return (errors as JsonApiErrors).type === 'jsonApiErrors';
}

export function isNativeError(error: unknown): error is NativeError {
  return (error as NativeError).type === 'nativeError';
}
