import { DistributedWorkerMessage, WorkerThreadStatus } from './types';
import { workerContext } from './worker-context';

export function postMessage(message: DistributedWorkerMessage) {
  workerContext.postMessage(message);
}

export function reportStatus(status: WorkerThreadStatus) {
  postMessage({
    type: 'STATUS_REPORT',
    payload: status,
  });
}

export function sendComputationSuccess(results: ArrayBuffer) {
  postMessage({
    type: 'COMPUTATION_SUCCESS',
    payload: results,
  });
}

export function sendComputationError(errors: string[]) {
  postMessage({
    type: 'COMPUTATION_ERROR',
    payload: errors,
  });
}
