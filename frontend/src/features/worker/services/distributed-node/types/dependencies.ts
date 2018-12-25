import fetch from 'isomorphic-unfetch';

import {
  CachedRegistrationService,
  KeepAliveService,
  SubtaskSerivce,
  SubtaskWorker,
  WorkerOptions,
} from 'features/worker/services';
import { ComputeSubtaskMessagePayload } from 'features/worker/worker-thread';

export interface DistributedNodeServiceDependencies {
  fetch: typeof fetch;

  keepAliveService: KeepAliveService;

  registrationService: CachedRegistrationService;

  subtaskService: SubtaskSerivce;

  subtaskWorkerFactory: (
    subtaskMetadata: ComputeSubtaskMessagePayload,
    options?: WorkerOptions,
  ) => SubtaskWorker;
}
