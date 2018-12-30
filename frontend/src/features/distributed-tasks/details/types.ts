import { WithRouterProps } from 'components/router';

import { SubtasksTableOwnProps } from 'features/subtasks/table';

import { RequestError } from 'error-handling';
import { DistributedTask, Subtask } from 'models';
import { BaseDependencies } from 'product-specific';

export interface DistributedTaskWithSubtasks extends DistributedTask {
  subtasks: Subtask[];
}

export interface DistributedTaskDetailsProps {
  distributedTaskDefinitionId: number;
  detailsData?: DistributedTask;
  tableData?: SubtasksTableOwnProps;
  dataFetchingError?: RequestError;
}

export interface DistributedTaskDetailsDependencies {
  kitsu: BaseDependencies['kitsu'];
}

export type PureDistributedTaskDetailsProps = DistributedTaskDetailsProps &
  DistributedTaskDetailsDependencies &
  WithRouterProps;

export interface DistributedTaskDetailsState {
  deleteRequestPending: boolean;
}
