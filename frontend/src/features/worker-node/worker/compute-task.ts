import { ProblemPluginInfo } from 'models';

import { workerContext } from './worker-context';

export function computeTask(
  problemPluginInfo: ProblemPluginInfo,
  inputData: ArrayBuffer,
) {
  const computeTaskMethodBinding = workerContext.Module.mono_bind_static_method(
    '[DistributedComputing] DistributedComputing.ProblemPluginFactory:ComputeTask',
    'sso',
  );

  const result: ArrayBuffer = computeTaskMethodBinding(
    problemPluginInfo['assembly-name'],
    `${problemPluginInfo.namespace}.${problemPluginInfo['class-name']}`,
    inputData,
  );

  return result;
}
