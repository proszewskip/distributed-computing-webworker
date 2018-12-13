import { WithRouterProps } from 'next/router';

import { RequestError } from 'error-handling';
import { DistributedTask } from 'models';
import { BaseDependencies } from 'product-specific';

export interface DistributedTaskDetailsInitialProps {
  id: number;
  data?: DistributedTask;
  error?: RequestError;
}

export interface DistributedTaskDetailsProps {
  onDeleteButtonClick: () => void;
  onBackButtonClick: () => void;
}

export interface DistributedTaskDetailsDependencies {
  kitsu: BaseDependencies['kitsu'];
}

export type PureDistributedTaskDetailsProps = DistributedTaskDetailsInitialProps &
  DistributedTaskDetailsProps &
  DistributedTaskDetailsDependencies &
  WithRouterProps;
