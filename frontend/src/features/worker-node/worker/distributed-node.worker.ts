import {
  BeginComputationPayload,
  DistributedNodeWorkerStatus,
  DistributedWorkerMessage,
} from './types';

import { appInitFactory } from './app-init-factory';
import { reportStatus, sendComputationError } from './communication-utils';
import { workerContext } from './worker-context';

// tslint:disable:no-console

workerContext.addEventListener('message', (event) => {
  const message: DistributedWorkerMessage = event.data;

  switch (message.type) {
    case 'BEGIN_COMPUTATION':
      beginComputation(message.payload);
      break;

    default:
      console.warn('Unknown message type', message.type);
      break;
  }
});

workerContext.addEventListener('error', (event) => {
  console.error('Unknown WebWorker error', event.error);

  reportStatus(DistributedNodeWorkerStatus.Error);
  sendComputationError(['Unknown error', `${event.error}`]);
});

reportStatus(DistributedNodeWorkerStatus.WaitingForTask);

workerContext.App = {
  init() {
    console.error(
      'App.init is not overridden and therefore, the computation may not continue',
    );
  },
};

async function beginComputation(payload: BeginComputationPayload) {
  reportStatus(DistributedNodeWorkerStatus.DownloadingTaskDefinition);

  try {
    workerContext.importScripts(
      `${payload.compiledTaskDefinitionURL}/mono-config.js`,
    );
    workerContext.importScripts(
      `${payload.compiledTaskDefinitionURL}/runtime.js`,
    );
  } catch (error) {
    reportStatus(DistributedNodeWorkerStatus.Error);
    sendComputationError([
      'Cannot load task definition data',
      error.toString(),
    ]);

    return;
  }

  workerContext.Module.locateFile = (fileName: string) =>
    `${payload.compiledTaskDefinitionURL}/${fileName}`;

  workerContext.App.init = appInitFactory(payload);

  try {
    workerContext.importScripts(`${payload.compiledTaskDefinitionURL}/mono.js`);
  } catch (error) {
    reportStatus(DistributedNodeWorkerStatus.Error);
    sendComputationError([
      'Cannot load task definition data',
      error.toString(),
    ]);
  }
}
