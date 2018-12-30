import {
  Button,
  Card,
  Heading,
  majorScale,
  Pane,
  Paragraph,
  Text,
} from 'evergreen-ui';
import React, { ReactNode, StatelessComponent } from 'react';

import { DistributedNodeRunningState } from 'features/worker/services';

import { WarnOnLeaving } from 'components/warn-on-leaving';

export interface RunningWorkerPageProps {
  onStopWorker: () => void;
  distributedNodeIdInfo: ReactNode;
  usedThreadsCard: ReactNode;
  workersTable: ReactNode;
  runningState: DistributedNodeRunningState;
  activeThreadsCount: number;
}

export const RunningWorkerPage: StatelessComponent<RunningWorkerPageProps> = ({
  onStopWorker,
  distributedNodeIdInfo,
  usedThreadsCard,
  workersTable,
  runningState,
  activeThreadsCount,
}) => (
  <>
    <Card border="default" padding={majorScale(2)} marginBottom={majorScale(2)}>
      <Paragraph marginBottom={majorScale(1)}>The worker is running.</Paragraph>

      <Pane marginBottom={majorScale(1)}>{distributedNodeIdInfo}</Pane>

      <Pane display="flex" justifyContent="center">
        <Button appearance="primary" onClick={onStopWorker}>
          Stop the worker
        </Button>
      </Pane>
    </Card>

    {usedThreadsCard}

    <Card border="default" padding={majorScale(2)} marginTop={majorScale(2)}>
      <Heading marginBottom="default">Worker information</Heading>

      <Paragraph>
        Status: <RunningStateInfo runningState={runningState} />
      </Paragraph>
    </Card>

    <Card border="default" padding={majorScale(2)} marginTop={majorScale(2)}>
      <Heading marginBottom="default">Individual thread statuses</Heading>

      <Paragraph marginBottom={majorScale(1)}>
        Active threads: {activeThreadsCount}
      </Paragraph>

      {workersTable}
    </Card>
    <WarnOnLeaving warn={true} leaveMessage="Are you sure you want to leave?" />
  </>
);

const RunningStateInfo: StatelessComponent<
  Pick<RunningWorkerPageProps, 'runningState'>
> = ({ runningState }) => {
  switch (runningState) {
    case DistributedNodeRunningState.AskingForNewTask:
      return <Text>Asking for a new task</Text>;

    case DistributedNodeRunningState.WaitingForEmptyThread:
      return <Text>Waiting for a free thread</Text>;

    case DistributedNodeRunningState.WaitingForTimeout:
      return <Text>Waiting for a timeout</Text>;
  }
};
