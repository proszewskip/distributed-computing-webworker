import React, { Component } from 'react';

import NodeWorker from './node.worker.ts';

interface WorkerProps {
  message: string;
}

export class Worker extends Component<WorkerProps> {
  public worker: NodeWorker | null = null;

  public componentDidMount() {
    this.worker = new NodeWorker();
    this.worker.postMessage(this.props.message);
  }

  public componentDidUpdate() {
    if (this.worker) {
      this.worker.postMessage(this.props.message);
    }
  }

  public componentWillUnmount() {
    if (this.worker) {
      this.worker.terminate();
    }
  }

  public render() {
    return <div>Worker</div>;
  }
}
