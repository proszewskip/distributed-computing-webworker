import { Entity } from 'models';

export interface DistributedNodeModel extends Entity {
  'trust-level': number;
  'last-keep-alive-time': number;
}
