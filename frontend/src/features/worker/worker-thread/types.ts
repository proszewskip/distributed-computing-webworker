import { ExtractNonNeverProperties } from 'types/extract-non-never-properties';

import { ProblemPluginInfo } from 'models';

export interface BaseWorkerThreadMessage<Type extends string, Payload> {
  type: Type;
  payload: Payload;
}

export interface ComputeSubtaskMessagePayload {
  problemPluginInfo: ProblemPluginInfo;
  compiledTaskDefinitionURL: string;
  inputDataURL: string;
}

export type ComputeSubtaskMessage = BaseWorkerThreadMessage<
  'COMPUTE_SUBTASK',
  ComputeSubtaskMessagePayload
>;

/**
 * The only message accepted by the `WorkerThread` is the message that instructs it to start
 * the computation.
 */
export type WorkerThreadInputMessage = ComputeSubtaskMessage;

export enum WorkerThreadStatus {
  WaitingForSubtaskInfo,
  LoadingTaskDefinition,
  LoadingInputData,
  Computing,
  ComputationSuccess,
  Finished,
  NetworkError,
  ComputationError,
  UnknownError,
}

export type WorkerThreadError = string[];

export interface WorkerUpdatedStatusData {
  [WorkerThreadStatus.WaitingForSubtaskInfo]: never;
  [WorkerThreadStatus.LoadingTaskDefinition]: never;
  [WorkerThreadStatus.LoadingInputData]: never;
  [WorkerThreadStatus.Computing]: never;
  [WorkerThreadStatus.ComputationSuccess]: ArrayBuffer;
  [WorkerThreadStatus.Finished]: never;
  [WorkerThreadStatus.NetworkError]: WorkerThreadError;
  [WorkerThreadStatus.ComputationError]: WorkerThreadError;
  [WorkerThreadStatus.UnknownError]: WorkerThreadError;
}

export type BaseWorkerUpdatedMessagePayload<
  Status extends WorkerThreadStatus
> = {
  status: Status;
} & ExtractNonNeverProperties<{ data: WorkerUpdatedStatusData[Status] }>;

export type WorkerUpdatedMessagePayload =
  | BaseWorkerUpdatedMessagePayload<WorkerThreadStatus.WaitingForSubtaskInfo>
  | BaseWorkerUpdatedMessagePayload<WorkerThreadStatus.LoadingTaskDefinition>
  | BaseWorkerUpdatedMessagePayload<WorkerThreadStatus.LoadingInputData>
  | BaseWorkerUpdatedMessagePayload<WorkerThreadStatus.Computing>
  | BaseWorkerUpdatedMessagePayload<WorkerThreadStatus.ComputationSuccess>
  | BaseWorkerUpdatedMessagePayload<WorkerThreadStatus.Finished>
  | BaseWorkerUpdatedMessagePayload<WorkerThreadStatus.NetworkError>
  | BaseWorkerUpdatedMessagePayload<WorkerThreadStatus.ComputationError>
  | BaseWorkerUpdatedMessagePayload<WorkerThreadStatus.UnknownError>;

export type WorkerUpdatedMessage = BaseWorkerThreadMessage<
  'WORKER_UPDATED',
  WorkerUpdatedMessagePayload
>;

/**
 * The only message sent by the `WorkerThread` is a message that the state of the worker
 * has updated.
 */
export type WorkerThreadOutputMessage = WorkerUpdatedMessage;
