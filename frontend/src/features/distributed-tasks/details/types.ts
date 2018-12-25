import { WithRouterProps } from 'components/router';

import { SubtasksTableOwnProps } from 'features/subtasks/table';

import { RequestError } from 'error-handling';
import { DistributedTask } from 'models';
import { BaseDependencies } from 'product-specific';

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
