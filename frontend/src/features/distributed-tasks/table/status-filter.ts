import { selectFilterFactory } from 'components/data-table/filters';

import { DistributedTaskStatus } from 'models';

export const DistributedTaskStatusFilter = selectFilterFactory([
  {
    label: 'Any',
    value: '',
  },
  {
    label: 'Done',
    value: DistributedTaskStatus.Done.toString(),
  },
  {
    label: 'In progress',
    value: DistributedTaskStatus.InProgress.toString(),
  },
  {
    label: 'Error',
    value: DistributedTaskStatus.Error.toString(),
  },
]);
