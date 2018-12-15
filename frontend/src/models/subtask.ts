import { Entity } from './entity';

export interface Subtask extends Entity {
  'sequence-number': number;
  'subtask-status': SubtaskStatus;
}

export enum SubtaskStatus {
  WaitingForExecution,
  Executing,
  Error,
  Done,
}
