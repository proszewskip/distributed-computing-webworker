import { WithRouterProps } from 'components/router';

import { RequestError } from 'error-handling';
import { DistributedTaskDefinition } from 'models';
import { BaseDependencies } from 'product-specific';

import { DistributedTasksTableOwnProps } from 'features/distributed-tasks';

export interface DistributedTaskDefinitionDetailsOwnProps {
  id: number;
  detailsData?: DistributedTaskDefinition;
  tableData?: DistributedTasksTableOwnProps;
  error?: RequestError;
}

export interface DistributedTaskDefinitionDetailsDependencies {
  kitsu: BaseDependencies['kitsu'];
}

export type PureDistributedTaskDefinitionDetailsProps = DistributedTaskDefinitionDetailsOwnProps &
  DistributedTaskDefinitionDetailsDependencies &
  WithRouterProps;

export interface DistributedTaskDefinitionDetailsState {
  deleteRequestPending: boolean;
}
