import { WithRouterProps } from 'components/router';

import { BaseDependencies } from 'product-specific';

export interface UpdateDistributedTaskModel {
  id: string;
  name: string;
  description: string;
  priority: number;
  'trust-level-to-complete': number;
}

export interface UpdateDistributedTaskDependencies {
  kitsu: BaseDependencies['kitsu'];
}

export interface UpdateDistributedTaskOwnProps {
  data: UpdateDistributedTaskModel;
}

export type UpdateDistributedTaskProps = UpdateDistributedTaskOwnProps &
  UpdateDistributedTaskDependencies &
  WithRouterProps;

export interface UpdateDistributedTaskState {
  data: UpdateDistributedTaskModel;
}
