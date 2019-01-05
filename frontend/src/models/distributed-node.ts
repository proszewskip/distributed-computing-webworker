import { Entity } from './entity';

export interface DistributedNode extends Entity {
  'trust-level': number;

  /**
   * Timestamp in miliseconds
   */
  'last-keep-alive-time': number;
}
