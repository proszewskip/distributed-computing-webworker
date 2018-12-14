import { WithRouterProps } from 'next/router';

import { SubtasksTableOwnProps } from 'features/subtasks/table/table';

import { RequestError } from 'error-handling';
import { DistributedTask } from 'models';
import { BaseDependencies } from 'product-specific';

export interface DistributedTaskDetailsProps {
  distributedTaskDefinitionId: number;
  detailsData?: DistributedTask;
  tableData?: SubtasksTableOwnProps;
  errors?: RequestError;
}

export interface DistributedTaskDetailsDependencies {
  kitsu: BaseDependencies['kitsu'];
}

export type PureDistributedTaskDetailsProps = DistributedTaskDetailsProps &
  DistributedTaskDetailsDependencies &
  WithRouterProps;
