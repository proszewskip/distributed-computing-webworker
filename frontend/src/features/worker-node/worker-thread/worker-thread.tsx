import { PureComponent } from 'react';

import { config } from 'product-specific';

import DistributedNodeWorker from './worker/distributed-node.worker.ts';

import { WorkerThreadProps } from './types';
import {
  BeginComputationMessage,
  ComputationErrorMessage,
  ComputationSuccessMessage,
  DistributedWorkerMessage,
  StatusReportMessage,
} from './worker';

export class WorkerThread extends PureComponent<WorkerThreadProps> {
  public worker: DistributedNodeWorker | null = null;

  public componentDidMount() {
    this.createWorker();
    this.beginComputation();
  }

  public componentDidUpdate() {
    if (this.worker) {
      this.destroyWorker();
    }

    this.createWorker();
    this.beginComputation();
  }

  public componentWillUnmount() {
    if (this.worker) {
      this.destroyWorker();
    }
  }

  public render() {
    return this.props.children || null;
  }

  private onWorkerMessage = (event: MessageEvent) => {
    const message: DistributedWorkerMessage = event.data;

    switch (message.type) {
      case 'STATUS_REPORT':
        this.onStatusReport(message);
        break;

      case 'COMPUTATION_SUCCESS':
        this.onComputationSuccess(message);
        break;

      case 'COMPUTATION_ERROR':
        this.onComputationError(message);
        break;
    }
  };

  private createWorker = () => {
    if (this.worker) {
      throw new Error(
        'Cannot override a worker. Destroy one first before creating a new one',
      );
    }

    this.worker = new DistributedNodeWorker();
    this.worker.addEventListener('message', this.onWorkerMessage);

    if (this.props.onWorkerCreated) {
      this.props.onWorkerCreated();
    }
  };

  private destroyWorker = () => {
    if (!this.worker) {
      throw new Error('Cannot destroy a worker - it does not exist');
    }

    this.worker.removeEventListener('message', this.onWorkerMessage);
    this.worker.terminate();
    this.worker = null;
  };

  private beginComputation = () => {
    if (!this.worker) {
      throw new Error('Cannot start a computation without a worker');
    }

    const { assignNextResponse } = this.props;

    const message: BeginComputationMessage = {
      type: 'BEGIN_COMPUTATION',
      payload: {
        compiledTaskDefinitionURL: `${config.serverUrl}${
          assignNextResponse['compiled-task-definition-url']
        }`,
        inputDataURL: `${config.serverUrl}/subtasks/${
          assignNextResponse['subtask-id']
        }/input-data`,
        problemPluginInfo: assignNextResponse['problem-plugin-info'],
      },
    };

    this.worker.postMessage(message);
  };

  private onStatusReport = (message: StatusReportMessage) => {
    if (this.props.onStatusChange) {
      this.props.onStatusChange(message.payload);
    }
  };

  private onComputationSuccess = (message: ComputationSuccessMessage) => {
    this.destroyWorker();

    if (this.props.onComputationSuccess) {
      this.props.onComputationSuccess(message.payload);
    }
  };

  private onComputationError = (message: ComputationErrorMessage) => {
    this.destroyWorker();

    if (this.props.onComputationError) {
      this.props.onComputationError(message.payload);
    }
  };
}