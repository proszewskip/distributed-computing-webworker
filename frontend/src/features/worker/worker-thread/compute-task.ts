import { ProblemPluginInfo } from 'models';

import { workerContext } from './worker-context';

/**
 * Computes the subtask using WebAssembly.
 *
 * @param problemPluginInfo Information about a class that implements `IProblemPlugin` in the
 * project.
 * @param inputData
 */
export function computeTask(
  problemPluginInfo: ProblemPluginInfo,
  inputData: ArrayBuffer,
) {
  const computeTaskMethodBinding = workerContext.Module.mono_bind_static_method(
    '[DistributedComputingLibrary] DistributedComputing.ProblemPluginFactory:ComputeTask',
    'sso',
  );

  const result: ArrayBuffer = computeTaskMethodBinding(
    problemPluginInfo['assembly-name'],
    `${problemPluginInfo.namespace}.${problemPluginInfo['class-name']}`,
    inputData,
  );

  return result;
}
