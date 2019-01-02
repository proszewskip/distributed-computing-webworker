import { WithRouterProps } from 'components/router';

import { SubtasksTableOwnProps } from 'features/subtasks/table';

import { RequestError } from 'error-handling';
import { DistributedTask, DistributedTaskDefinition, Subtask } from 'models';
import { BaseDependencies } from 'product-specific';

export interface DistributedTaskWithDefinition extends DistributedTask {
  'distributed-task-definition': DistributedTaskDefinition;
}

export interface DistributedTaskWithSubtasksAndDefinition
  extends DistributedTaskWithDefinition {
  subtasks: Subtask[];
}

export interface DistributedTaskDetailsProps {
  distributedTaskDefinitionId: number;
  detailsData?: DistributedTaskWithDefinition;
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
