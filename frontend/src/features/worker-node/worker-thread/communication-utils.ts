import {
  WorkerThreadOutputMessage,
  WorkerUpdatedMessagePayload,
  WorkerUpdatedStatusData,
} from './types';
import { workerContext } from './worker-context';

function postMessage(message: WorkerThreadOutputMessage) {
  workerContext.postMessage(message);
}

/**
 * Sends an update message to the main thread
 *
 * @param payload
 */
export function sendUpdateMessage(payload: WorkerUpdatedMessagePayload) {
  postMessage({
    type: 'WORKER_UPDATED',
    payload,
  });
}

/**
 * Simple statuses that require no additional data in the payload
 */
type SimpleStatus = {
  [Status in keyof WorkerUpdatedStatusData]: WorkerUpdatedStatusData[Status] extends never
    ? Status
    : never
}[keyof WorkerUpdatedStatusData];

/**
 * Sends an update message with the specified status.
 *
 * @param status Status that does not require any additional data
 */
export function sendStatusUpdate(status: SimpleStatus) {
  // NOTE: no idea how to overcome this TS error
  sendUpdateMessage({
    status,
  } as any);
}
