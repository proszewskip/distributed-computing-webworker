import fetch from 'isomorphic-unfetch';

import { ProblemPluginInfo } from 'models';

export interface SubtaskServiceDependencies {
  fetch: typeof fetch;
}

/**
 * Response from the subtask assignment. Determines the subtask that the worker will compute.
 */
export interface AssignNextResponseBody {
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

export interface ComputationSuccessRequestBody {
  subtaskInProgressId: string;
  distributedNodeId: string;
  subtaskResult: ArrayBuffer;
}

export interface ComputationErrorRequestBody {
  subtaskInProgressId: string;
  distributedNodeId: string;
  errors: string[];
}

export interface ComputationCancelRequestBody {
  subtaskInProgressId: string;
  distributedNodeId: string;
}
