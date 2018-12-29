import { Map } from 'immutable';

import { ExtractNonNeverProperties } from 'types/extract-non-never-properties';

import { SubtaskWorker } from 'features/worker/services';
import { WorkerUpdatedMessagePayload } from 'features/worker/worker-thread';

/**
 * Inner state when the worker has started
 */
export enum DistributedNodeRunningState {
  AskingForNewTask = 'ASKING_FOR_A_NEW_TASK',
  WaitingForEmptyThread = 'WAITING_FOR_EMPTY_THREAD',
  WaitingForTimeout = 'WAITING_FOR_TIMEOUT',
}

export interface DistributedNodeRunningStateData {
  [DistributedNodeRunningState.AskingForNewTask]: never;
  [DistributedNodeRunningState.WaitingForEmptyThread]: never;
  [DistributedNodeRunningState.WaitingForTimeout]: {
    timeoutId: number;
  };
}

export interface SubtaskWorkerInfo {
  worker: SubtaskWorker;
  state: WorkerUpdatedMessagePayload;
}

export type BaseDistribuedNodeRunningStateWithData<
  RunningState extends DistributedNodeRunningState
> = {
  runningState: RunningState;
} & ExtractNonNeverProperties<{
  subtaskWorkers: Map<number, SubtaskWorkerInfo>;
  data: DistributedNodeRunningStateData[RunningState];
}>;

export type DistributedNodeRunningStateWithData =
  | BaseDistribuedNodeRunningStateWithData<
      DistributedNodeRunningState.AskingForNewTask
    >
  | BaseDistribuedNodeRunningStateWithData<
      DistributedNodeRunningState.WaitingForEmptyThread
    >
  | BaseDistribuedNodeRunningStateWithData<
      DistributedNodeRunningState.WaitingForTimeout
    >;
