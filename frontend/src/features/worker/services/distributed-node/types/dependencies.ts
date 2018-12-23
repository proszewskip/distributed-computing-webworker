import fetch from 'isomorphic-unfetch';

import {
  KeepAliveService,
  RegistrationService,
  SubtaskSerivce,
  SubtaskWorker,
  WorkerOptions,
} from 'features/worker/services';
import { ComputeSubtaskMessagePayload } from 'features/worker/worker-thread';

export interface DistributedNodeServiceDependencies {
  fetch: typeof fetch;

  keepAliveService: KeepAliveService;

  /**
   * TODO: use a service that saves the node's id locally after the initial registration
   * and tries to reuse it next time.
   */
  registrationService: RegistrationService;

  subtaskService: SubtaskSerivce;

  subtaskWorkerFactory: (
    subtaskMetadata: ComputeSubtaskMessagePayload,
    options?: WorkerOptions,
  ) => SubtaskWorker;
}
