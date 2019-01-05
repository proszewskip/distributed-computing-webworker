import { Entity } from './entity';

export interface DistributedTask extends Entity {
  name: string;
  description: string;

  /**
   * The higher, the sooner the task will be assigned to nodes.
   */
  priority: number;

  'trust-level-to-complete': number;
  errors: string[];
  status: DistributedTaskStatus;
}

export enum DistributedTaskStatus {
  InProgress,
  Error,
  Done,
}
