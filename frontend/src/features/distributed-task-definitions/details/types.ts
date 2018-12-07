import { WithRouterProps } from 'next/router';

import { RequestError } from 'error-handling';
import { DistributedTaskDefinition } from 'models';
import { BaseDependencies } from 'product-specific';

export interface DistributedTaskDefinitionDetailsInitialProps {
  id: number;
  data?: DistributedTaskDefinition;
  error?: RequestError;
}

export interface DistributedTaskDefinitionDetailsProps {
  onDeleteButtonClick: () => void;
  onBackButtonClick: () => void;
}

export interface DistributedTaskDefinitionDetailsDependencies {
  kitsu: BaseDependencies['kitsu'];
}

export type PureDistributedTaskDefinitionDetailsProps = DistributedTaskDefinitionDetailsInitialProps &
  DistributedTaskDefinitionDetailsProps &
  DistributedTaskDefinitionDetailsDependencies &
  WithRouterProps;