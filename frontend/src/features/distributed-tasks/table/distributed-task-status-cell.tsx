import { Text } from 'evergreen-ui';
import React, { StatelessComponent } from 'react';

import { DistributedTaskStatus } from 'models';

import { DistributedTaskWithDefinition } from './types';

export interface DistributedTaskStatusCellProps {
  row: DistributedTaskWithDefinition;
}

export const DistributedTaskStatusCell: StatelessComponent<
  DistributedTaskStatusCellProps
> = ({ row }) => {
  switch (row.status) {
    case DistributedTaskStatus.InProgress:
      return <Text>In progress</Text>;

    case DistributedTaskStatus.Error:
      return <Text color="danger">Error</Text>;

    case DistributedTaskStatus.Done:
      return <Text color="success">Done</Text>;

    default:
      return <Text>Unknown</Text>;
  }
};
