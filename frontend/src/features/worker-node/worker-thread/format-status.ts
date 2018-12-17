import { ReactNode } from 'react';

import { WorkerThreadStatus } from './worker';

const formatDictionary: { [status in WorkerThreadStatus]: ReactNode } = {
  [WorkerThreadStatus.Computed]: 'Computed',
  [WorkerThreadStatus.Computing]: 'Computing',
  [WorkerThreadStatus.DownloadingInputData]: 'Downloading input data',
  [WorkerThreadStatus.DownloadingTaskDefinition]: 'Downloading task definition',
  [WorkerThreadStatus.Error]: 'Error',
  [WorkerThreadStatus.WaitingForTask]: 'Waiting for a task',
};

export const formatWorkerThreadStatus = (status: WorkerThreadStatus) =>
  formatDictionary[status];
