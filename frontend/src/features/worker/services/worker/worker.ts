import {
  ComputeSubtaskMessage,
  ComputeSubtaskMessagePayload,
  WorkerThreadOutputMessage,
  WorkerThreadStatus,
  WorkerUpdatedMessagePayload,
} from 'features/worker/worker-thread';

import {
  WorkerComputationResult,
  WorkerDependencies,
  WorkerOptions,
} from './types';

export class SubtaskWorker {
  private readonly dependencies: WorkerDependencies;
  private readonly options: WorkerOptions;
  private readonly subtaskMetadata: ComputeSubtaskMessagePayload;
  private workerThread?: Worker;

  constructor(
    dependencies: WorkerDependencies,
    subtaskMetadata: ComputeSubtaskMessagePayload,
    options: WorkerOptions = {},
  ) {
    this.dependencies = dependencies;
    this.options = options;
    this.subtaskMetadata = subtaskMetadata;
  }

  public start(): Promise<WorkerComputationResult> {
    if (this.workerThread) {
      return Promise.reject('Worker thread is already running');
    }

    const workerThread = this.dependencies.workerThreadProvider();

    this.workerThread = workerThread;
    this.workerThread.addEventListener('message', this.onWorkerThreadMessage);

    return new Promise((resolve, reject) => {
      this.resolveComputationPromise = resolve;
      this.rejectComputationPromise = reject;

      const message: ComputeSubtaskMessage = {
        type: 'COMPUTE_SUBTASK',
        payload: this.subtaskMetadata,
      };

      workerThread.postMessage(message);
    });
  }

  public cancel() {
    if (!this.workerThread) {
      throw new Error('Worker thread is not running');
    }

    this.rejectComputationPromise();
    this.destroyWorkerThread();
  }

  private destroyWorkerThread = () => {
    if (!this.workerThread) {
      return;
    }

    this.workerThread.removeEventListener(
      'message',
      this.onWorkerThreadMessage,
    );
    this.workerThread.terminate();
    this.workerThread = undefined;
    this.resolveComputationPromise = () => undefined;
    this.rejectComputationPromise = () => undefined;
  };

  private onWorkerThreadMessage = (event: MessageEvent) => {
    const message: WorkerThreadOutputMessage = event.data;

    switch (message.type) {
      case 'WORKER_UPDATED':
        this.onWorkerUpdated(message.payload);
        break;

      default:
        // tslint:disable-next-line:no-console
        console.error('Unknown WorkerThread output message type', message);
        break;
    }
  };

  private onWorkerUpdated = (payload: WorkerUpdatedMessagePayload) => {
    if (this.options.onWorkerUpdate) {
      this.options.onWorkerUpdate(payload);
    }

    switch (payload.status) {
      case WorkerThreadStatus.ComputationSuccess:
      case WorkerThreadStatus.ComputationError:
      case WorkerThreadStatus.NetworkError:
      case WorkerThreadStatus.UnknownError:
        this.resolveComputationPromise(payload);
        this.destroyWorkerThread();
        break;

      default:
        break;
    }
  };

  /**
   * Callback that resolves the promise returned by the `start` method
   */
  private resolveComputationPromise: (
    result: WorkerComputationResult,
  ) => void = () => undefined;

  /**
   * Callback that rejects the promise returned by the `start` method
   */
  private rejectComputationPromise: (reason?: any) => void = () => undefined;
}
