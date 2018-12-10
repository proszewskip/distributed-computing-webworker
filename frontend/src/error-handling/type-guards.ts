import { JsonApiErrorResponse } from 'kitsu';

export function isJsonApiErrorResponse(
  error: unknown,
): error is JsonApiErrorResponse {
  return !!(error as JsonApiErrorResponse).errors;
}

export function isNativeError(error: unknown): error is Error {
  return error instanceof Error;
}
