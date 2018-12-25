import { Text } from 'evergreen-ui';
import React, { StatelessComponent } from 'react';
import { TableCellRenderer } from 'react-table';

import { WorkerThreadStatus } from 'features/worker/worker-thread';

export const WorkerStatusCell: TableCellRenderer = (row) => (
  <WorkerStatus status={row.value} />
);

const WorkerStatus: StatelessComponent<{ status: WorkerThreadStatus }> = ({
  status,
}) => {
  switch (status) {
    case WorkerThreadStatus.WaitingForSubtaskInfo:
      return <Text>Waiting for subtask info</Text>;

    case WorkerThreadStatus.LoadingTaskDefinition:
      return <Text>Loading task definition DLLs</Text>;

    case WorkerThreadStatus.LoadingInputData:
      return <Text>Loading input data</Text>;

    case WorkerThreadStatus.Computing:
      return <Text color="info">Computing</Text>;

    case WorkerThreadStatus.ComputationSuccess:
      return <Text color="success">Computation success</Text>;

    case WorkerThreadStatus.ComputationError:
      return <Text color="danger">Computation error</Text>;

    case WorkerThreadStatus.NetworkError:
      return <Text color="danger">Network error</Text>;

    case WorkerThreadStatus.UnknownError:
      return <Text color="danger">Unknown error</Text>;

    default:
      return <Text>Unknown status</Text>;
  }
};
