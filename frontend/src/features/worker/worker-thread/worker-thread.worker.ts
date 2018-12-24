import {
  ComputeSubtaskMessagePayload,
  WorkerThreadInputMessage,
  WorkerThreadStatus,
} from './types';

import { appInitFactory } from './app-init-factory';
import { sendStatusUpdate, sendUpdateMessage } from './communication-utils';
import { workerContext } from './worker-context';

// tslint:disable:no-console

workerContext.addEventListener('message', (event) => {
  const message: WorkerThreadInputMessage = event.data;

  switch (message.type) {
    case 'COMPUTE_SUBTASK':
      beginComputation(message.payload);
      break;

    default:
      console.warn('Unknown message type', message.type);
      break;
  }
});

workerContext.addEventListener('error', (event) => {
  console.error('Unknown WebWorker error', event.error);

  sendUpdateMessage({
    status: WorkerThreadStatus.UnknownError,
    data: ['Unknown error', `${event.error}`],
  });
});

sendStatusUpdate(WorkerThreadStatus.WaitingForSubtaskInfo);

workerContext.App = {
  init() {
    console.error(
      'App.init is not overridden and therefore, the computation may not continue',
    );
    sendUpdateMessage({
      status: WorkerThreadStatus.UnknownError,
      data: [
        'App.init called before it is overwritten with a proper implementation',
      ],
    });
  },
};

async function beginComputation(payload: ComputeSubtaskMessagePayload) {
  sendStatusUpdate(WorkerThreadStatus.LoadingTaskDefinition);

  try {
    workerContext.importScripts(
      `${payload.compiledTaskDefinitionURL}/mono-config.js`,
    );
    workerContext.importScripts(
      `${payload.compiledTaskDefinitionURL}/runtime.js`,
    );
  } catch (error) {
    sendUpdateMessage({
      status: WorkerThreadStatus.NetworkError,
      data: ['Cannot load task definition data', error.toString()],
    });
    sendStatusUpdate(WorkerThreadStatus.Finished);

    return;
  }

  workerContext.Module.locateFile = (fileName: string) =>
    `${payload.compiledTaskDefinitionURL}/${fileName}`;

  workerContext.App.init = appInitFactory(payload);

  try {
    workerContext.importScripts(`${payload.compiledTaskDefinitionURL}/mono.js`);
  } catch (error) {
    sendUpdateMessage({
      status: WorkerThreadStatus.NetworkError,
      data: ['Cannot load task definition data', error.toString()],
    });
    sendStatusUpdate(WorkerThreadStatus.Finished);
  }
}
