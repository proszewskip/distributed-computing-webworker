import { Card, majorScale, Pane, Paragraph, Spinner } from 'evergreen-ui';
import React, { StatelessComponent } from 'react';

export const PristineWorkerPage: StatelessComponent = () => (
  <Card border="default" padding={majorScale(2)}>
    <Paragraph marginBottom={majorScale(1)}>
      The worker is initializing. Please wait.
    </Paragraph>

    <Pane display="flex" justifyContent="center">
      <Spinner />
    </Pane>
  </Card>
);
