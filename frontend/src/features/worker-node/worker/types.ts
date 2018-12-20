import {
  BaseWorkerUpdatedMessagePayload,
  WorkerThreadStatus,
  WorkerUpdatedMessagePayload,
} from '../worker-thread';

export type WorkerThreadProvider = () => Worker;

export interface WorkerDependencies {
  workerThreadProvider: WorkerThreadProvider;
}

export interface WorkerOptions {
  onWorkerUpdate?: (payload: WorkerUpdatedMessagePayload) => void;
}

export type WorkerComputationResult =
  | BaseWorkerUpdatedMessagePayload<WorkerThreadStatus.ComputationSuccess>
  | BaseWorkerUpdatedMessagePayload<WorkerThreadStatus.ComputationError>
  | BaseWorkerUpdatedMessagePayload<WorkerThreadStatus.NetworkError>
  | BaseWorkerUpdatedMessagePayload<WorkerThreadStatus.UnknownError>;
