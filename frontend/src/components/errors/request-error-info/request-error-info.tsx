import * as React from 'react';

import { isNativeError, RequestError } from 'error-handling';

import { JsonApiErrorsInfo } from './json-api-errors-info';
import { NativeErrorInfo } from './native-error-info';

export interface RequestErrorInfoProps {
  error: RequestError;
}

/**
 * Displays information about an error that could occur in the system.
 *
 * Handles native and JSON API errors.
 */
export const RequestErrorInfo: React.SFC<RequestErrorInfoProps> = ({
  error,
}) => {
  if (isNativeError(error)) {
    return <NativeErrorInfo error={error} />;
  }

  return <JsonApiErrorsInfo errors={error.errors} />;
};
