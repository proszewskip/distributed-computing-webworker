import React, { StatelessComponent } from 'react';

import { NativeError } from 'error-handling';

import { ErrorInfo } from './error-info';

export interface NativeErrorInfoProps {
  error: NativeError;
}

export const NativeErrorInfo: StatelessComponent<NativeErrorInfoProps> = ({
  error,
}) => <ErrorInfo title={error.name}>{error.message}</ErrorInfo>;
