import { Entity } from 'models';
import { BaseDependencies } from 'product-specific';

export interface UpdateDistributedNodeModel extends Entity {
  'trust-level': number;
}

export interface UpdateDistributedNodeFormDependencies {
  kitsu: BaseDependencies['kitsu'];
}

export interface UpdateDistributedNodeFormOwnProps {
  data: UpdateDistributedNodeModel;
  onFormComplete: () => void;
}

export type UpdateDistributedNodeFormProps = UpdateDistributedNodeFormOwnProps &
  UpdateDistributedNodeFormDependencies;

export interface UpdateDistributedNodeFormState {
  data: UpdateDistributedNodeModel;
}
