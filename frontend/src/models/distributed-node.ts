import { Entity } from './entity';

export interface DistributedNode extends Entity {
  'trust-level': number;
  'last-keep-alive-time': number;
}
