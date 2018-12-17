import React, { Component } from 'react';

import DistributedNodeWorker from './worker/distributed-node.worker.ts';

import { DistributedNodeProps, DistributedNodeState } from './types';
import {
  BeginComputationMessage,
  DistributedNodeWorkerStatus,
  DistributedWorkerMessage,
} from './worker';

export class DistributedNode extends Component<
  DistributedNodeProps,
  DistributedNodeState
> {
  public worker: DistributedNodeWorker | null = null;

  public state: DistributedNodeState = {
    workerStatus: DistributedNodeWorkerStatus.WaitingForTask,
  };

  public componentDidMount() {
    this.worker = new DistributedNodeWorker();
    this.worker.addEventListener('message', this.onWorkerMessage);
    this.beginComputation();
  }

  public componentWillUnmount() {
    if (this.worker) {
      this.worker.removeEventListener('message', this.onWorkerMessage);
      this.worker.terminate();
    }
  }

  public render() {
    return <div>Worker status: {this.state.workerStatus}</div>;
  }

  private onWorkerMessage = (event: MessageEvent) => {
    const message: DistributedWorkerMessage = event.data;

    console.log('Message from worker', message);
  };

  private beginComputation = () => {
    if (!this.worker) {
      return;
    }

    const { assignNextResponse } = this.props;

    const message: BeginComputationMessage = {
      type: 'BEGIN_COMPUTATION',
      payload: {
        compiledTaskDefinitionURL:
          assignNextResponse['compiled-task-definition-url'],
        inputDataURL: `http://localhost:5000/subtasks/${
          assignNextResponse['subtask-id']
        }/input-data`,
        problemPluginInfo: assignNextResponse['problem-plugin-info'],
      },
    };

    this.worker.postMessage(message);
  };
}
