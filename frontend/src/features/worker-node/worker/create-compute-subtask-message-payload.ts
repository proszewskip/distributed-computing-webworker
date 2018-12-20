import { config } from 'product-specific';

import { AssignNextResponseBody } from '../subtask-service';
import { ComputeSubtaskMessagePayload } from '../worker-thread';

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
