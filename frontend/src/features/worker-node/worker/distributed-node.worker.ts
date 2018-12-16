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

(context as any).App = {
  init() {
    console.log('a');
  },
};

async function beginComputation(payload: BeginComputationPayload) {
  reportStatus(DistributedNodeWorkerStatus.DownloadingTaskDefinition);

  importScripts(
    `${payload.compiledTaskDefinitionURL}/runtime.js`,
    `${payload.compiledTaskDefinitionURL}/mono.js`,
  );

  reportStatus(DistributedNodeWorkerStatus.DownloadingInputData);
  const response = await fetch(payload.inputDataURL);
  const data = await response.arrayBuffer();

  reportStatus(DistributedNodeWorkerStatus.Computing);

  {
    const { problemPluginInfo } = payload;
    // NOTE: This needs to run after the worker is initialized
    debugger;
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
      '[DistributedComputingLibrary] DistributedComputing.ProblemPluginFactory:CreateProblemPlugin',
    );

    const problemPluginInstanceJSObj = createTaskInstance(
      problemPluginInfo['assembly-name'],
      `${problemPluginInfo.namespace}.${problemPluginInfo['class-name']}`,
    );
    const problemPluginInstance = BINDING.extract_mono_obj(
      problemPluginInstanceJSObj,
    );

    debugger;

    const result = BINDING.call_method(
      computeMethod,
      problemPluginInstance,
      's',
      ['abcd'],
    );

    console.log(result);
  }

  reportStatus(DistributedNodeWorkerStatus.Computed);
  sendComputationResults(null);
}

function foo() {}

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
