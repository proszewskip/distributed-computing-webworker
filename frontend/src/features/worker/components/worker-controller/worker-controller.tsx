import {
  Button,
  Heading,
  IconButton,
  majorScale,
  Pane,
  Paragraph,
} from 'evergreen-ui';
import React, { Component, ReactNode } from 'react';

import { withDependencies } from 'components/dependency-injection/with-dependencies';

import {
  DistributedNodeState,
  OnDistributedNodeStateUpdate,
} from 'features/worker/services';

import { WorkersTable } from '../workers-table';
import { dependenciesExtractor } from './dependencies';
import { PureWorkerControllerProps, WorkerControllerState } from './types';

export class PureWorkerController extends Component<
  PureWorkerControllerProps,
  WorkerControllerState
> {
  public state: WorkerControllerState = {
    threadsCount: 1,
  };

  public componentDidMount() {
    const distributedNodeService = this.props.distributedNodeServiceFactory(
      this.onDistributedNodeStateUpdate,
    );

    distributedNodeService.setThreadsCount(this.state.threadsCount);
    distributedNodeService.init();

    this.setState({
      distributedNodeService,
    });
  }

  public componentWillUnmount() {
    if (this.state.distributedNodeService) {
      this.state.distributedNodeService.destroy();
    }
  }

  public render() {
    return (
      <Pane margin={majorScale(1)}>
        <Heading size={700} marginBottom={majorScale(1)}>
          Worker node
        </Heading>

        <Paragraph>
          State:{' '}
          {this.state.distributedNodeState &&
            this.state.distributedNodeState.state}
        </Paragraph>
        {this.renderContent()}
      </Pane>
    );
  }

  private onDistributedNodeStateUpdate: OnDistributedNodeStateUpdate = (
    newState,
  ) => {
    this.setState({
      distributedNodeState: newState,
    });
  };

  private renderContent = (): ReactNode => {
    const { distributedNodeState } = this.state;

    if (
      !distributedNodeState ||
      distributedNodeState.state === DistributedNodeState.Pristine
    ) {
      return 'Initializing the worker';
    }

    if (distributedNodeState.state === DistributedNodeState.Idle) {
      return <Button onClick={this.startNode}>Start</Button>;
    }

    if (distributedNodeState.state === DistributedNodeState.Registering) {
      return 'Registering the node';
    }

    if (distributedNodeState.state === DistributedNodeState.Running) {
      return (
        <>
          <Paragraph>Running.</Paragraph>
          <Button onClick={this.stopNode}>Stop</Button>
          <Paragraph>For now, open the console to see the state.</Paragraph>

          <Pane>
            Threads count: {this.state.threadsCount}
            <IconButton icon="plus" onClick={this.incrementThreadsCount} />
            <IconButton icon="minus" onClick={this.decrementThreadsCount} />
          </Pane>

          <Pane>
            Workers count: {distributedNodeState.data.subtaskWorkers.size}
          </Pane>

          <Pane maxWidth={400}>
            <WorkersTable
              subtaskWorkers={distributedNodeState.data.subtaskWorkers}
              maxWorkersCount={this.state.threadsCount}
            />
          </Pane>

          <Pane>{distributedNodeState.data.runningState}</Pane>
        </>
      );
    }

    return 'Unknown state. Something is broken :(';
  };

  private incrementThreadsCount = () => {
    const newThreadsCount = this.state.threadsCount + 1;

    this.setState({
      threadsCount: newThreadsCount,
    });

    if (this.state.distributedNodeService) {
      this.state.distributedNodeService.setThreadsCount(newThreadsCount);
    }
  };

  private decrementThreadsCount = () => {
    const newThreadsCount = this.state.threadsCount - 1;

    this.setState({
      threadsCount: newThreadsCount,
    });

    if (this.state.distributedNodeService) {
      this.state.distributedNodeService.setThreadsCount(newThreadsCount);
    }
  };

  private startNode = () => {
    if (this.state.distributedNodeService) {
      this.state.distributedNodeService.start();
    }
  };

  private stopNode = () => {
    if (this.state.distributedNodeService) {
      this.state.distributedNodeService.stop();
    }
  };
}

export const WorkerController = withDependencies(dependenciesExtractor)(
  PureWorkerController,
);
