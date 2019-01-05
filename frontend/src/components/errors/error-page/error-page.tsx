import { Card, Heading, majorScale, minorScale } from 'evergreen-ui';
import React, { StatelessComponent } from 'react';

/**
 * A component that should be used when the page should display top-level errors.
 */
export const ErrorPage: StatelessComponent = ({ children }) => {
  return (
    <Card background="redTint" padding={majorScale(3)} maxWidth={600}>
      <Heading marginBottom={minorScale(2)}>An error occurred</Heading>

      {children}
    </Card>
  );
};
