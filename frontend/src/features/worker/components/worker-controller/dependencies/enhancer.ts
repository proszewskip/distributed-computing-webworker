import { DependenciesEnhancer } from 'components/dependency-injection/enhancer';

import { BaseDependencies } from 'product-specific';

import {
  DistributedNodeService,
  KeepAliveService,
  RegistrationService,
  SubtaskSerivce,
  SubtaskWorker,
} from 'features/worker/services';

// @ts-ignore
import WorkerThread from 'features/worker/worker-thread/worker-thread.worker';

import {
  DistributedNodeServiceFactory,
  WorkerControllerDependencies,
} from './types';

export const dependenciesEnhancer: DependenciesEnhancer<
  BaseDependencies,
  BaseDependencies & WorkerControllerDependencies
> = (baseDependencies) => {
  const { fetch } = baseDependencies;

  const keepAliveService = new KeepAliveService({
    fetch,
  });
  const registrationService = new RegistrationService({
    fetch,
  });
  const subtaskService = new SubtaskSerivce({
    fetch,
  });

  const distributedNodeServiceFactory: DistributedNodeServiceFactory = (
    onDistributedNodeStateUpdate,
  ) =>
    new DistributedNodeService(
      {
        fetch,
        keepAliveService,
        registrationService,
        subtaskService,
        subtaskWorkerFactory: (subtaskMetadata, options) =>
          new SubtaskWorker(
            {
              workerThreadProvider: () => new WorkerThread(),
            },
            subtaskMetadata,
            options,
          ),
      },
      onDistributedNodeStateUpdate,
    );

  return {
    ...baseDependencies,
    distributedNodeServiceFactory,
  };
};
