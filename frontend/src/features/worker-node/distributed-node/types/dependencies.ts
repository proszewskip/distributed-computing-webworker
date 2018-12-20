import fetch from 'isomorphic-unfetch';

import {
  ComputeSubtaskMessagePayload,
  SubtaskWorker,
} from 'features/worker-node';
import { KeepAliveService } from 'features/worker-node/keep-alive';
import { RegistrationService } from 'features/worker-node/registration';
import { SubtaskSerivce } from 'features/worker-node/subtask-service';
import { WorkerOptions } from 'features/worker-node/worker';

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
