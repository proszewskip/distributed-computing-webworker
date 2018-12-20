import {
  Button,
  Heading,
  IconButton,
  majorScale,
  Pane,
  Paragraph,
} from 'evergreen-ui';
import fetch from 'isomorphic-unfetch';
import React, { Component, ReactNode } from 'react';

import { Layout, LayoutProps } from 'components/layout';

import {
  DistributedNodeService,
  DistributedNodeState,
  DistributedNodeStateWithData,
  KeepAliveService,
  OnDistributedNodeStateUpdate,
  RegistrationService,
  SubtaskSerivce,
  SubtaskWorker,
} from 'features/worker-node';

// @ts-ignore
import WorkerThread from 'features/worker-node/worker-thread/worker-thread.worker';

import {
  AuthenticatedSidebar,
  BaseDependenciesProvider,
  Head,
} from 'product-specific';

interface WorkerExampleState {
  distributedNodeService?: DistributedNodeService;
  distributedNodeState?: DistributedNodeStateWithData;
  threadsCount: number;
}

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

class WorkerExample extends Component<{}, WorkerExampleState> {
  public state: WorkerExampleState = {
    threadsCount: 1,
  };

  public componentDidMount() {
    const keepAliveService = new KeepAliveService({
      fetch,
    });
    const registrationService = new RegistrationService({
      fetch,
    });
    const subtaskService = new SubtaskSerivce({
      fetch,
    });
    const distributedNodeService = new DistributedNodeService(
      {
        fetch,
        keepAliveService,
        registrationService,
        subtaskService,
        subtaskWorkerFactory: (subtaskMetadata, options) =>
          new SubtaskWorker(
            {
              workerThreadProvider: () => new WorkerThread(),
            },
            subtaskMetadata,
            options,
          ),
      },
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
      <>
        <Head />

        <BaseDependenciesProvider>
          <Layout renderSidebar={renderSidebar}>
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
          </Layout>
        </BaseDependenciesProvider>
      </>
    );
  }

  private onDistributedNodeStateUpdate: OnDistributedNodeStateUpdate = (
    newState,
  ) => {
    // tslint:disable-next-line:no-console
    console.log(newState);

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

export default WorkerExample;
