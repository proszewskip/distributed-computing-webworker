import { Entity } from './entity';

export interface Subtask extends Entity {
  'sequence-number': number;
  'subtask-status': SubtaskStatus;
  errors: string[];
}

export enum SubtaskStatus {
  WaitingForExecution,
  Executing,
  Error,
  Done,
}
