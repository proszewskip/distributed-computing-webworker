import { Entity } from './entity';

export interface DistributedTask extends Entity {
  name: string;
  description: string;
  priority: number;
  'trust-level-to-complete': number;
  errors: string[];
  status: number;
}

export enum DistributedTaskStatus {
  InProgress,
  Error,
  Done,
}
