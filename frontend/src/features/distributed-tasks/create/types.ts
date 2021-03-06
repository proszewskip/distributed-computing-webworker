import { WithRouterProps } from 'components/router';

export interface CreateDistributedTaskModel {
  DistributedTaskDefinitionId: string;
  Name: string;
  Description: string;
  Priority: number;
  TrustLevelToComplete: number;
  InputData: File | null;
}

export interface CreateDistributedTaskOwnProps {
  distributedTaskDefinitionId: string;
}

export type CreateDistributedTaskProps = CreateDistributedTaskOwnProps &
  WithRouterProps;

export interface CreateDistributedTaskState {
  data: CreateDistributedTaskModel;
}
