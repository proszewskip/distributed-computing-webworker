import { sendStatusUpdate, sendUpdateMessage } from './communication-utils';
import { computeTask } from './compute-task';
import { ComputeSubtaskMessagePayload, WorkerThreadStatus } from './types';
import { workerContext } from './worker-context';

export const appInitFactory = (
  payload: ComputeSubtaskMessagePayload,
) => async () => {
  try {
    // NOTE: This needs to run after the worker is initialized
    workerContext.BINDING.bindings_lazy_init();
  } catch (error) {
    sendUpdateMessage({
      status: WorkerThreadStatus.UnknownError,
      data: ['Cannot initialize WASM bindings', error.toString()],
    });
    sendStatusUpdate(WorkerThreadStatus.Finished);
    return;
  }

  sendStatusUpdate(WorkerThreadStatus.LoadingInputData);
  let inputData: ArrayBuffer;
  try {
    inputData = await downloadInputData(payload);
  } catch (error) {
    sendUpdateMessage({
      status: WorkerThreadStatus.NetworkError,
      data: ['Cannot download input data', error.toString()],
    });
    sendStatusUpdate(WorkerThreadStatus.Finished);
    return;
  }

  sendStatusUpdate(WorkerThreadStatus.Computing);
  let result: ArrayBuffer;
  try {
    result = computeTask(payload.problemPluginInfo, inputData);
  } catch (error) {
    sendUpdateMessage({
      status: WorkerThreadStatus.ComputationError,
      data: ['Computation error', error.toString()],
    });
    sendStatusUpdate(WorkerThreadStatus.Finished);
    return;
  }

  sendUpdateMessage({
    status: WorkerThreadStatus.ComputationSuccess,
    data: result,
  });
  sendStatusUpdate(WorkerThreadStatus.Finished);
};

async function downloadInputData(payload: ComputeSubtaskMessagePayload) {
  return fetch(payload.inputDataURL).then((response) => response.arrayBuffer());
}
