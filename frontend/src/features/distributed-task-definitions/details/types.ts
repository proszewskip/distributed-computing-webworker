import { WithRouterProps } from 'next/router';

import { RequestError } from 'error-handling';
import { DistributedTaskDefinition } from 'models';
import { BaseDependencies } from 'product-specific';

export interface DistributedTaskDefinitionDetailsOwnProps {
  id: number;
  data?: DistributedTaskDefinition;
  error?: RequestError;
}

export interface DistributedTaskDefinitionDetailsDependencies {
  kitsu: BaseDependencies['kitsu'];
}

export type PureDistributedTaskDefinitionDetailsProps = DistributedTaskDefinitionDetailsOwnProps &
  DistributedTaskDefinitionDetailsDependencies &
  WithRouterProps;

export interface DistributedTaskDefinitionDetailsState {
  deleteButtonDisabled: boolean;
}
