import {
  ComputeSubtaskMessagePayload,
  SubtaskWorker,
} from 'features/worker-node';
import { KeepAliveService } from 'features/worker-node/keep-alive';
import { RegistrationService } from 'features/worker-node/registration';

export interface DistributedNodeDependencies {
  fetch: GlobalFetch['fetch'];

  keepAliveService: KeepAliveService;

  /**
   * TODO: use a service that saves the node's id locally after the initial registration
   * and tries to reuse it next time.
   */
  registrationService: RegistrationService;

  subtaskWorkerFactory: (
    options: WorkerOptions,
    subtaskMetadata: ComputeSubtaskMessagePayload,
  ) => SubtaskWorker;
}
