import { Button, Heading, majorScale, Pane, Paragraph } from 'evergreen-ui';
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
}

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

class WorkerExample extends Component<{}, WorkerExampleState> {
  public state: WorkerExampleState = {};

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
    console.log('State updated', newState);

    this.setState({
      distributedNodeState: newState,
    });
  };

  private renderContent = (): ReactNode => {
    if (
      !this.state.distributedNodeState ||
      this.state.distributedNodeState.state === DistributedNodeState.Pristine
    ) {
      return 'Initializing the worker';
    }

    if (this.state.distributedNodeState.state === DistributedNodeState.Idle) {
      return <Button onClick={this.startNode}>Start</Button>;
    }

    if (
      this.state.distributedNodeState.state === DistributedNodeState.Registering
    ) {
      return 'Registering the node';
    }

    if (
      this.state.distributedNodeState.state === DistributedNodeState.Running
    ) {
      return (
        <>
          <Paragraph>Running.</Paragraph>
          <Button onClick={this.stopNode}>Stop</Button>
          For now, open the console to see the state.
        </>
      );
    }

    return 'Unknown state. Something is broken :(';
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
