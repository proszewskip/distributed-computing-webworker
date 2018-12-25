import { Text } from 'evergreen-ui';
import { Map } from 'immutable';
import React, { StatelessComponent } from 'react';
import { Column } from 'react-table';

import { TextCell } from 'components/data-table/cells';
import { StyledDataTable } from 'components/data-table/styled-data-table';

import { SubtaskWorkerInfo } from 'features/worker/services';
import { WorkerThreadStatus } from 'features/worker/worker-thread';

export interface WorkersTableProps {
  subtaskWorkers: Map<number, SubtaskWorkerInfo>;
  maxWorkersCount: number;
}

interface WorkerTableItem {
  id: number;
  status: WorkerThreadStatus;
}

const columns: Array<Column<WorkerTableItem>> = [
  {
    id: 'id',
    accessor: 'id',
    Header: <Text>ID</Text>,
    Cell: TextCell,
    width: 200,
  },
  {
    id: 'status',
    accessor: 'status',
    Header: <Text>Status</Text>,
    // TODO: use a special cell to display the status
    Cell: TextCell,
    width: 200,
  },
];

export const WorkersTable: StatelessComponent<WorkersTableProps> = ({
  subtaskWorkers,
  maxWorkersCount,
}) => (
  <StyledDataTable
    columns={columns}
    defaultPageSize={maxWorkersCount}
    PaginationComponent={NullComponent}
    NoDataComponent={NullComponent}
    data={subtaskWorkers
      .entrySeq()
      .map(
        ([workerId, workerInfo]): WorkerTableItem => ({
          id: workerId,
          status: workerInfo.state.status,
        }),
      )
      .toList()}
  />
);

const NullComponent: StatelessComponent<any> = () => null;
