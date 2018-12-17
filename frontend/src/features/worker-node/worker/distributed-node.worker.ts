// import fetch from 'node-fetch';

import {
  BeginComputationPayload,
  DistributedNodeWorkerStatus,
  DistributedWorkerMessage,
} from './types';

// tslint:disable:no-console

// NOTE: missing type definitons
declare const importScripts: (...urls: string[]) => void;
// NOTE: Provided when loading mono.js and runtime.js
declare const BINDING: any;
declare const Module: any;

const context: Worker = self as any;

context.addEventListener('message', (event) => {
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

console.log('Worker started, waiting for a task');
reportStatus(DistributedNodeWorkerStatus.WaitingForTask);

const App: { init(): void } = {
  init() {
    console.error(
      'App.init is not overridden and therefore, the computation may not continue',
    );
  },
};

(context as any).App = App;

async function beginComputation(payload: BeginComputationPayload) {
  reportStatus(DistributedNodeWorkerStatus.DownloadingTaskDefinition);

  /**
   * Provide a way to locate wasm files (i.e. mono.wasm) on the server
   * https://github.com/Gelio/distributed-computing-webworker-poc/blob/master/mono-wasm-sdk/debug/mono.js#L1516
   */
  (context as any).getDeployPrefix = (pathSuffix: string) =>
    `${payload.compiledTaskDefinitionURL}/${pathSuffix}`;

  importScripts(`${payload.compiledTaskDefinitionURL}/runtime.js`);

  Module.locateFile = (fileName: string) =>
    `${payload.compiledTaskDefinitionURL}/${fileName}`;

  const { problemPluginInfo } = payload;

  App.init = () => {
    // NOTE: This needs to run after the worker is initialized
    BINDING.bindings_lazy_init();
    const loadedAssembly = BINDING.assembly_load(
      problemPluginInfo['assembly-name'],
    );

    const taskClass = BINDING.find_class(
      loadedAssembly,
      problemPluginInfo.namespace,
      problemPluginInfo['class-name'],
    );

    // No idea what -1 means, but it is used in all find_method calls
    const computeMethod = BINDING.find_method(taskClass, 'Compute', -1);

    const createTaskInstance = Module.mono_bind_static_method(
      '[DistributedComputing] DistributedComputing.ProblemPluginFactory:CreateProblemPlugin',
    );

    const problemPluginInstanceJSObj = createTaskInstance(
      problemPluginInfo['assembly-name'],
      `${problemPluginInfo.namespace}.${problemPluginInfo['class-name']}`,
    );
    const problemPluginInstance = BINDING.extract_mono_obj(
      problemPluginInstanceJSObj,
    );

    const result = BINDING.call_method(
      computeMethod,
      problemPluginInstance,
      's',
      ['abcd'],
    );

    console.log(result);
  };

  importScripts(`${payload.compiledTaskDefinitionURL}/mono-config.js`);
  importScripts(`${payload.compiledTaskDefinitionURL}/mono.js`);

  reportStatus(DistributedNodeWorkerStatus.DownloadingInputData);
  const response = await fetch(payload.inputDataURL);
  const data = await response.arrayBuffer();

  reportStatus(DistributedNodeWorkerStatus.Computing);

  reportStatus(DistributedNodeWorkerStatus.Computed);
  sendComputationResults(null);
}

function postMessage(message: DistributedWorkerMessage) {
  context.postMessage(message);
}

function reportStatus(status: DistributedNodeWorkerStatus) {
  postMessage({
    type: 'STATUS_REPORT',
    payload: status,
  });
}

function sendComputationResults(results: any) {
  postMessage({
    type: 'COMPUTATION_RESULTS',
    payload: results,
  });
}
