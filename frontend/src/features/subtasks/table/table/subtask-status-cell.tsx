import { Alert, Text } from 'evergreen-ui';
import React, { ReactNode } from 'react';

import { SubtaskStatus } from 'models';

const statusMapping: { [status in SubtaskStatus]: ReactNode } = {
  [SubtaskStatus.Done]: <Text>Done</Text>,
  [SubtaskStatus.Executing]: <Text>In progress</Text>,
  [SubtaskStatus.Error]: <Alert intent="danger">Error</Alert>,
  [SubtaskStatus.WaitingForExecution]: <Text>Waiting for execution</Text>,
};

export const SubtaskStatusCell = (row: { value: SubtaskStatus }) => {
  return statusMapping[row.value];
};
