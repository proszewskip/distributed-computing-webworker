import { ReactNode } from 'react';

import { DistributedTaskStatus } from 'models';

export const formatDistributedTaskStatus = (
  status: DistributedTaskStatus,
): ReactNode => {
  switch (status) {
    case DistributedTaskStatus.Done:
      return 'Done';
    case DistributedTaskStatus.Error:
      return 'Errors occured';
    case DistributedTaskStatus.InProgress:
      return ' In progress';
    default:
      return 'Unknown status';
  }
};
