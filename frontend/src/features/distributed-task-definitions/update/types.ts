import { WithRouterProps } from 'next/router';
import { BaseDependencies } from 'product-specific';

export interface UpdateDistributedTaskDefinitionModel {
  id: string;
  name: string;
  description: string;
}

export interface UpdateDistributedTaskDefinitionState {
  data: UpdateDistributedTaskDefinitionModel;
}

export interface UpdateDistributedTaskDefinitionDependencies {
  kitsu: BaseDependencies['kitsu'];
}

export interface UpdateDistributedTaskDefinitionOwnProps {
  data: UpdateDistributedTaskDefinitionModel;
}

export type UpdateDistributedTaskDefinitionProps = UpdateDistributedTaskDefinitionOwnProps &
  UpdateDistributedTaskDefinitionDependencies &
  WithRouterProps;
