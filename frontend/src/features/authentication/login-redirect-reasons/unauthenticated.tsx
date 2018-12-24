import { Alert } from 'evergreen-ui';
import React, { StatelessComponent } from 'react';

export const Unauthenticated: StatelessComponent = () => (
  <Alert intent="warning" title="You have been logged out.">
    This could happen due to a long inactivity. Please log in again.
  </Alert>
);
