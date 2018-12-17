import {
  reportStatus,
  sendComputationError,
  sendComputationSuccess,
} from './communication-utils';
import { computeTask } from './compute-task';
import { BeginComputationPayload, DistributedNodeWorkerStatus } from './types';
import { workerContext } from './worker-context';

export const appInitFactory = (
  payload: BeginComputationPayload,
) => async () => {
  try {
    // NOTE: This needs to run after the worker is initialized
    workerContext.BINDING.bindings_lazy_init();
  } catch (error) {
    reportStatus(DistributedNodeWorkerStatus.Error);
    sendComputationError(['Cannot initialize wasm bindings']);
  }

  reportStatus(DistributedNodeWorkerStatus.DownloadingInputData);
  let inputData: ArrayBuffer;
  try {
    inputData = await downloadInputData(payload);
  } catch (error) {
    reportStatus(DistributedNodeWorkerStatus.Error);
    sendComputationError(['Cannot download input data', error.toString()]);
    return;
  }

  reportStatus(DistributedNodeWorkerStatus.Computing);
  let result: ArrayBuffer;
  try {
    result = computeTask(payload.problemPluginInfo, inputData);
  } catch (error) {
    reportStatus(DistributedNodeWorkerStatus.Error);
    sendComputationError(['Computation error', error.toString()]);
    return;
  }

  reportStatus(DistributedNodeWorkerStatus.Computed);
  sendComputationSuccess(result);
};

async function downloadInputData(payload: BeginComputationPayload) {
  return fetch(payload.inputDataURL).then((response) => response.arrayBuffer());
}
