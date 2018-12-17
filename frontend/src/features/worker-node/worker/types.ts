import { ProblemPluginInfo } from 'models';

export interface BaseWorkerMessage<Type extends string, Payload> {
  type: Type;
  payload: Payload;
}

export interface BeginComputationPayload {
  problemPluginInfo: ProblemPluginInfo;
  compiledTaskDefinitionURL: string;
  inputDataURL: string;
}

export type BeginComputationMessage = BaseWorkerMessage<
  'BEGIN_COMPUTATION',
  BeginComputationPayload
>;

export enum DistributedNodeWorkerStatus {
  WaitingForTask,
  DownloadingTaskDefinition,
  DownloadingInputData,
  Computing,
  Error,
  Computed,
}

export type StatusReportMessage = BaseWorkerMessage<
  'STATUS_REPORT',
  DistributedNodeWorkerStatus
>;

export type ComputationSuccessMessage = BaseWorkerMessage<
  'COMPUTATION_SUCCESS',
  ArrayBuffer
>;

export type ComputationErrorMessage = BaseWorkerMessage<
  'COMPUTATION_ERROR',
  string[]
>;

export type DistributedWorkerMessage =
  | BeginComputationMessage
  | StatusReportMessage
  | ComputationSuccessMessage
  | ComputationErrorMessage;
