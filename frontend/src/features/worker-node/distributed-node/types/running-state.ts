import { Map } from 'immutable';

import { ExtractNonNeverProperties } from 'types/extract-non-never-properties';

import { SubtaskWorker } from 'features/worker-node/worker';

/**
 * Inner state when the worker has started
 */
export enum DistributedNodeRunningState {
  AskingForNewTask = 'ASKING_FOR_A_NEW_TASK',
  StartedNewWorker = 'STARTED_NEW_WORKER_THREAD',
  WaitingForEmptyThread = 'WAITING_FOR_EMPTY_THREAD',
  WaitingForTimeout = 'WAITING_FOR_TIMEOUT',
}

export interface DistributedNodeRunningStateData {
  [DistributedNodeRunningState.AskingForNewTask]: never;
  [DistributedNodeRunningState.StartedNewWorker]: never;
  [DistributedNodeRunningState.WaitingForEmptyThread]: never;
  [DistributedNodeRunningState.WaitingForTimeout]: {
    timeoutId: number;
  };
}

export type BaseDistribuedNodeRunningStateWithData<
  RunningState extends DistributedNodeRunningState
> = {
  runningState: RunningState;
} & ExtractNonNeverProperties<{
  subtaskWorkers: Map<number, SubtaskWorker>;
  data: DistributedNodeRunningStateData[RunningState];
}>;

export type DistributedNodeRunningStateWithData =
  | BaseDistribuedNodeRunningStateWithData<
      DistributedNodeRunningState.AskingForNewTask
    >
  | BaseDistribuedNodeRunningStateWithData<
      DistributedNodeRunningState.StartedNewWorker
    >
  | BaseDistribuedNodeRunningStateWithData<
      DistributedNodeRunningState.WaitingForEmptyThread
    >
  | BaseDistribuedNodeRunningStateWithData<
      DistributedNodeRunningState.WaitingForTimeout
    >;
