import { config } from 'product-specific';

import { ComputeSubtaskMessagePayload } from 'features/worker/worker-thread';

import { AssignNextResponseBody } from '../subtask-service';

export function createComputeSubtaskMessagePayload(
  assignNextResponse: AssignNextResponseBody,
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
