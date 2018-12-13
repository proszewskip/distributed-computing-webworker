import { Alert, Text } from 'evergreen-ui';
import React from 'react';

import { SubtaskStatus } from 'models';

export const SubtaskStatusCell = (row: { value: SubtaskStatus }) => {
  return (
    (row.value === SubtaskStatus.Done && <Text>Done</Text>) ||
    (row.value === SubtaskStatus.Executing && <Text>In progress</Text>) ||
    (row.value === SubtaskStatus.WaitingForExecution && (
      <Text>Waiting for execution</Text>
    )) ||
    (row.value === SubtaskStatus.Error && <Alert intent="danger">Error</Alert>)
  );
};
