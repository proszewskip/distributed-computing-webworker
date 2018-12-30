import { Heading, majorScale, Pane, Paragraph } from 'evergreen-ui';
import React, { Component, ReactNode } from 'react';

import { withDependencies } from 'components/dependency-injection/with-dependencies';

import {
  DistributedNodeState,
  OnDistributedNodeStateUpdate,
} from 'features/worker/services';

import { DistributedNodeIdInfo } from '../distributed-node-id-info';
import {
  IdleWorkerPage,
  PristineWorkerPage,
  RegisteringWorkerPage,
  RunningWorkerPage,
} from '../pages-by-status';
import { UsedThreadsCard, UsedThreadsCardProps } from '../used-threads-card';
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
          Worker Node
        </Heading>

        <Pane maxWidth={600}>{this.renderContent()}</Pane>
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
    const { distributedNodeState, threadsCount } = this.state;

    if (
      !distributedNodeState ||
      distributedNodeState.state === DistributedNodeState.Pristine
    ) {
      return <PristineWorkerPage />;
    }

    if (distributedNodeState.state === DistributedNodeState.Registering) {
      return <RegisteringWorkerPage />;
    }

    const distributedNodeIdInfo = (
      <DistributedNodeIdInfo id={distributedNodeState.data.distributedNodeId} />
    );
    const usedThreadsCard = (
      <UsedThreadsCard
        threadsCount={threadsCount}
        onChange={this.onChangeThreadsCount}
      />
    );

    if (distributedNodeState.state === DistributedNodeState.Idle) {
      return (
        <IdleWorkerPage
          onStartWorker={this.startNode}
          distributedNodeIdInfo={distributedNodeIdInfo}
          usedThreadsCard={usedThreadsCard}
        />
      );
    }

    if (distributedNodeState.state === DistributedNodeState.Running) {
      const workersTable = (
        <WorkersTable
          subtaskWorkers={distributedNodeState.data.subtaskWorkers}
          maxWorkersCount={threadsCount}
        />
      );

      return (
        <RunningWorkerPage
          distributedNodeIdInfo={distributedNodeIdInfo}
          onStopWorker={this.stopNode}
          runningState={distributedNodeState.data.runningState}
          usedThreadsCard={usedThreadsCard}
          workersTable={workersTable}
          activeThreadsCount={distributedNodeState.data.subtaskWorkers.size}
        />
      );
    }

    return <Paragraph>Unknown state. Something is broken :(</Paragraph>;
  };

  private onChangeThreadsCount: UsedThreadsCardProps['onChange'] = (
    newThreadsCount,
  ) => {
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
