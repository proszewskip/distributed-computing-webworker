import { Card, majorScale, Pane, Paragraph, Spinner } from 'evergreen-ui';
import React, { StatelessComponent } from 'react';

export const RegisteringWorkerPage: StatelessComponent = () => (
  <Card border="default" padding={majorScale(2)}>
    <Paragraph marginBottom={majorScale(1)}>
      The worker is registering in the system. Please wait.
    </Paragraph>

    <Pane display="flex" justifyContent="center">
      <Spinner />
    </Pane>
  </Card>
);
