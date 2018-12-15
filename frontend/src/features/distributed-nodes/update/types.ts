import { Entity } from 'models';
import { BaseDependencies } from 'product-specific';

export interface UpdateDistributedNodeModel extends Entity {
  'trust-level': number;
}

export interface UpdateDistributedNodeDependencies {
  kitsu: BaseDependencies['kitsu'];
}

export interface UpdateDistributedNodeOwnProps {
  data: UpdateDistributedNodeModel;
  closeDialog: () => void;
}

export type UpdateDistributedNodeProps = UpdateDistributedNodeOwnProps &
  UpdateDistributedNodeDependencies;

export interface UpdateDistributedNodeState {
  data: UpdateDistributedNodeModel;
}
