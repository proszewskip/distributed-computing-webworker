import { Alert } from 'evergreen-ui';
import React, { ReactNode, StatelessComponent } from 'react';

export interface ErrorInfoProps {
  title: ReactNode;
}

export const ErrorInfo: StatelessComponent<ErrorInfoProps> = ({
  children,
  title,
}) => {
  return (
    <Alert intent="danger" title={title}>
      {children}
    </Alert>
  );
};
