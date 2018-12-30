import { Button, Card, majorScale, Pane, Paragraph } from 'evergreen-ui';
import React, { ReactNode, StatelessComponent } from 'react';

export interface IdleWorkerPageProps {
  onStartWorker: () => void;
  distributedNodeIdInfo: ReactNode;
  usedThreadsCard: ReactNode;
}

export const IdleWorkerPage: StatelessComponent<IdleWorkerPageProps> = ({
  onStartWorker,
  distributedNodeIdInfo,
  usedThreadsCard,
}) => (
  <>
    <Card border="default" padding={majorScale(2)} marginBottom={majorScale(2)}>
      <Paragraph marginBottom={majorScale(1)}>
        The worker is registered in the system and ready to be started.
      </Paragraph>

      <Pane marginBottom={majorScale(1)}>{distributedNodeIdInfo}</Pane>

      <Pane display="flex" justifyContent="center">
        <Button appearance="primary" onClick={onStartWorker}>
          Start the worker
        </Button>
      </Pane>
    </Card>

    {usedThreadsCard}
  </>
);
