export interface CreateDistributedTaskModel {
  DistributedTaskDefinitionId: string;
  Name: string;
  Description: string;
  Priority: number;
  TrustLevelToComplete: number;
  InputData: File | null;
}

export interface CreateDistributedTaskProps {
  id: string;
}

export interface CreateDistributedTaskState {
  data: CreateDistributedTaskModel;
}
