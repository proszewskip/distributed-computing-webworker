import React, { StatelessComponent } from 'react';

import { ErrorInfo } from './error-info';

export interface NativeErrorInfoProps {
  error: Error;
}

export const NativeErrorInfo: StatelessComponent<NativeErrorInfoProps> = ({
  error,
}) => <ErrorInfo title={error.name}>{error.message}</ErrorInfo>;
