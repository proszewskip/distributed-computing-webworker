import { config } from 'product-specific';

import { ComputeSubtaskMessagePayload } from '../worker-thread';

import { AssignNextResponse } from './types';

export function createComputeSubtaskMessagePayload(
  assignNextResponse: AssignNextResponse,
): ComputeSubtaskMessagePayload {
  return {
    compiledTaskDefinitionURL: `${config.serverUrl}${
      assignNextResponse['compiled-task-definition-url']
    }`,
    inputDataURL: `${config.serverUrl}/subtasks/${
      assignNextResponse['subtask-id']
    }/input-data`,
    problemPluginInfo: assignNextResponse['problem-plugin-info'],
  };
}
