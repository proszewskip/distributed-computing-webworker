import { Button, Heading, majorScale, Pane } from 'evergreen-ui';
import React, { Component, ReactNode } from 'react';

import { Layout, LayoutProps } from 'components/layout';

import {
  AssignNextResponse,
  formatWorkerThreadStatus,
  WorkerThreadComponent,
  WorkerThreadProps,
  WorkerThreadStatus,
} from 'features/worker-node';

import {
  AuthenticatedSidebar,
  BaseDependenciesProvider,
  config,
  Head,
} from 'product-specific';

enum WorkerExampleStatus {
  BeforeRegistering,
  Registering,
  Registered,
  FetchingNextSubtaskInfo,
  ReceivedNextSubtaskInfo,
  Computing,
  SendingResponse,
  DelayBeforeReady,
}

interface WorkerExampleState {
  status: WorkerExampleStatus;
  distributedNodeId?: string;

  assignNextResponse?: AssignNextResponse;

  workerThreadStatus?: WorkerThreadStatus;
}

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <AuthenticatedSidebar />
);

class WorkerExample extends Component<{}, WorkerExampleState> {
  public state: WorkerExampleState = {
    status: WorkerExampleStatus.BeforeRegistering,
  };

  public async componentDidMount() {
    this.setState({
      status: WorkerExampleStatus.Registering,
    });

    const registerResponse = await fetch(
      `${config.serverUrl}/distributed-nodes/register`,
      {
        method: 'POST',
      },
    );
    const registerBody = await registerResponse.json();
    const distributedNodeId = registerBody.data.attributes.id;

    this.setState({
      status: WorkerExampleStatus.Registered,
      distributedNodeId,
    });
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

  private renderContent = (): ReactNode => {
    switch (this.state.status) {
      case WorkerExampleStatus.BeforeRegistering:
        return 'Waiting for registration request';

      case WorkerExampleStatus.Registered:
        return (
          <Button onClick={this.fetchNextSubtask}>Fetch next subtask</Button>
        );

      case WorkerExampleStatus.FetchingNextSubtaskInfo:
        return 'Fetching next subtask info';

      case WorkerExampleStatus.ReceivedNextSubtaskInfo:
        return (
          <>
            Received next subtask info
            {this.renderWorkerThread()}
          </>
        );

      case WorkerExampleStatus.Computing:
        return (
          <>
            Computing
            {this.renderWorkerThread()}
            {formatWorkerThreadStatus(this.state.workerThreadStatus as any)}
          </>
        );

      case WorkerExampleStatus.SendingResponse:
        return 'Sending the response';

      case WorkerExampleStatus.DelayBeforeReady:
        return 'Response sent. Please wait before you can continue computing.';
    }

    return null;
  };

  private fetchNextSubtask = async () => {
    const { distributedNodeId } = this.state;

    if (!distributedNodeId) {
      return;
    }

    const response = await fetch(`${config.serverUrl}/subtasks/assign-next`, {
      method: 'POST',
      body: JSON.stringify({
        'distributed-node-id': distributedNodeId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const assignNextResponse: AssignNextResponse = await response.json();

    this.setState({
      assignNextResponse,
      status: WorkerExampleStatus.ReceivedNextSubtaskInfo,
    });
  };

  private renderWorkerThread = (): ReactNode => {
    const { assignNextResponse } = this.state;

    if (!assignNextResponse) {
      return null;
    }

    return (
      <WorkerThreadComponent
        assignNextResponse={assignNextResponse}
        onWorkerCreated={this.onWorkerCreated}
        onComputationError={this.onComputationError}
        onComputationSuccess={this.onComputationSuccess}
        onStatusChange={this.onStatusChange}
      />
    );
  };

  private onWorkerCreated: WorkerThreadProps['onWorkerCreated'] = () => {
    this.setState({
      status: WorkerExampleStatus.Computing,
    });
  };

  private onComputationError: WorkerThreadProps['onComputationError'] = async (
    errors,
  ) => {
    this.setState({
      status: WorkerExampleStatus.SendingResponse,
    });

    const { assignNextResponse, distributedNodeId } = this.state;

    if (!assignNextResponse || !distributedNodeId) {
      return;
    }

    const formData = new FormData();
    formData.set(
      'SubtaskInProgressId',
      assignNextResponse['subtask-in-progress-id'],
    );
    formData.set('DistributedNodeId', distributedNodeId);
    errors.forEach((error) => {
      formData.set('Errors', error);
    });

    await fetch(`${config.serverUrl}/subtasks-in-progress/computation-error`, {
      method: 'POST',
      body: formData,
    });

    this.delayBeforeReady();
  };

  private onComputationSuccess: WorkerThreadProps['onComputationSuccess'] = async (
    results,
  ) => {
    this.setState({
      status: WorkerExampleStatus.SendingResponse,
    });

    const { assignNextResponse, distributedNodeId } = this.state;

    if (!assignNextResponse || !distributedNodeId) {
      return;
    }

    const formData = new FormData();
    formData.set(
      'SubtaskInProgressId',
      assignNextResponse['subtask-in-progress-id'],
    );
    formData.set('DistributedNodeId', distributedNodeId);
    formData.set('SubtaskResult', new Blob([results]));

    await fetch(
      `${config.serverUrl}/subtasks-in-progress/computation-success`,
      {
        method: 'POST',
        body: formData,
      },
    );

    this.delayBeforeReady();
  };

  private onStatusChange: WorkerThreadProps['onStatusChange'] = (status) => {
    this.setState({
      workerThreadStatus: status,
    });
  };

  private delayBeforeReady = async () => {
    this.setState({
      status: WorkerExampleStatus.DelayBeforeReady,
    });

    const DELAY = 1000;
    await delay(DELAY);

    this.setState({
      status: WorkerExampleStatus.Registered,
    });
  };
}

export default WorkerExample;

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
