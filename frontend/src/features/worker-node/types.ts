import { ProblemPluginInfo } from 'models';

import { DistributedNodeWorkerStatus } from './worker';

export interface AssignNextResponse {
  /**
   * SubtaskInProgress's id
   *
   * Necessary to report the computation result.
   */
  'subtask-in-progress-id': string;

  /**
   * Subtask's id
   *
   * Necessary the download the input data
   */
  'subtask-id': string;

  /**
   * The base URL to the directory that contains the compiled task definition.
   */
  'compiled-task-definition-url': string;

  /**
   * Information about the assembly that is required for the computation.
   */
  'problem-plugin-info': ProblemPluginInfo;
}

export interface DistributedNodeProps {
  /**
   * The ID of the DistributedNode received from the server during registering.
   */
  distributedNodeId: string;

  /**
   * Response from the subtask assignment. Determines the subtask that the worker will compute.
   */
  assignNextResponse: AssignNextResponse;
}

export interface DistributedNodeState {
  workerStatus: DistributedNodeWorkerStatus;
}
