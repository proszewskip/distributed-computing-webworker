import {
  ComputeSubtaskMessage,
  ComputeSubtaskMessagePayload,
  WorkerThreadOutputMessage,
  WorkerThreadStatus,
} from 'features/worker/worker-thread';

import { WorkerComputationResult, WorkerThreadProvider } from './types';
import { SubtaskWorker } from './worker';

describe('SubtaskWorker', () => {
  let workerThread: Worker;
  let workerThreadProvider: WorkerThreadProvider;
  let subtaskMetadata: ComputeSubtaskMessagePayload;

  beforeEach(() => {
    workerThread = {
      addEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
      onerror: null,
      onmessage: null,
      postMessage: jest.fn(),
      removeEventListener: jest.fn(),
      terminate: jest.fn(),
    };
    workerThreadProvider = jest.fn(() => workerThread);

    subtaskMetadata = {
      compiledTaskDefinitionURL: 'task definition url',
      inputDataURL: 'input data url',
      problemPluginInfo: {
        'assembly-name': 'assembly',
        'class-name': 'class',
        namespace: 'namespace',
      },
    };
  });

  describe('start', () => {
    it('should instantiate a worker', () => {
      const subtaskWorker = new SubtaskWorker(
        { workerThreadProvider },
        subtaskMetadata,
      );

      subtaskWorker.start();

      expect(workerThreadProvider).toHaveBeenCalled();
    });

    it('should send a message to the worker', () => {
      const subtaskWorker = new SubtaskWorker(
        { workerThreadProvider },
        subtaskMetadata,
      );

      subtaskWorker.start();

      expect(workerThread.postMessage).toHaveBeenCalledWith(
        jasmine.objectContaining({
          type: 'COMPUTE_SUBTASK',
          payload: subtaskMetadata,
        } as ComputeSubtaskMessage),
      );
    });

    it('should listen for worker thread messages', () => {
      const subtaskWorker = new SubtaskWorker(
        { workerThreadProvider },
        subtaskMetadata,
      );

      subtaskWorker.start();

      expect(workerThread.addEventListener).toHaveBeenCalled();
    });

    it('should reject with an error when called twice', async () => {
      const subtaskWorker = new SubtaskWorker(
        { workerThreadProvider },
        subtaskMetadata,
      );

      subtaskWorker.start();

      expect.assertions(1);

      try {
        await subtaskWorker.start();
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('cancel', () => {
    it('should reject when called without starting the worker first', () => {
      const subtaskWorker = new SubtaskWorker(
        { workerThreadProvider },
        subtaskMetadata,
      );

      expect(() => subtaskWorker.cancel()).toThrow();
    });

    describe('after starting the service', () => {
      let subtaskWorker: SubtaskWorker;
      let computationPromise: Promise<unknown>;
      let wasErrorCaught: boolean;

      beforeEach(() => {
        subtaskWorker = new SubtaskWorker(
          { workerThreadProvider },
          subtaskMetadata,
        );

        wasErrorCaught = false;
        computationPromise = subtaskWorker.start().catch(() => {
          wasErrorCaught = true;
        });
      });

      it('should reject the computation promise', async () => {
        subtaskWorker.cancel();
        await computationPromise;

        expect(wasErrorCaught).toBe(true);
      });

      it('should terminate the worker thread', async () => {
        subtaskWorker.cancel();
        await computationPromise;

        expect(workerThread.terminate).toHaveBeenCalled();
      });

      it('should throw an error when called twice', async () => {
        subtaskWorker.cancel();
        await computationPromise;

        expect(() => subtaskWorker.cancel()).toThrow();
      });
    });
  });

  describe('computation promise should resolve', () => {
    let subtaskWorker: SubtaskWorker;
    let computationPromise: Promise<WorkerComputationResult>;
    let onWorkerThreadMessage: (message: MessageEvent) => void;

    beforeEach(() => {
      subtaskWorker = new SubtaskWorker(
        { workerThreadProvider },
        subtaskMetadata,
      );

      computationPromise = subtaskWorker.start();
      onWorkerThreadMessage = (workerThread.addEventListener as jest.Mock).mock
        .calls[0][1];
    });

    it('upon an error', async () => {
      const messageData: WorkerThreadOutputMessage = {
        type: 'WORKER_UPDATED',
        payload: {
          status: WorkerThreadStatus.ComputationError,
          data: ['computation error info'],
        },
      };
      onWorkerThreadMessage({ data: messageData } as MessageEvent);

      const result = await computationPromise;

      expect(result).toBe(messageData.payload);
      expect(workerThread.terminate).toHaveBeenCalled();
    });

    it('upon a computation success', async () => {
      const messageData: WorkerThreadOutputMessage = {
        type: 'WORKER_UPDATED',
        payload: {
          status: WorkerThreadStatus.ComputationSuccess,
          data: new ArrayBuffer(10),
        },
      };
      onWorkerThreadMessage({ data: messageData } as MessageEvent);

      const result = await computationPromise;

      expect(result).toBe(messageData.payload);
      expect(workerThread.terminate).toHaveBeenCalled();
    });
  });
});
