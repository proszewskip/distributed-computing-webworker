import { ExtractNonNeverProperties } from 'types/extract-non-never-properties';

import { DistributedNodeRunningStateWithData } from './running-state';

export enum DistributedNodeState {
  /**
   * Before any commands have been issued
   */
  Pristine,
  Registering,

  /**
   * Registered and waiting for the user to start the node
   */
  Idle,
  Running,
}

export interface DistributedNodeIdState {
  distributedNodeId: string;
}

export interface DistributedNodeStateData {
  [DistributedNodeState.Pristine]: never;
  [DistributedNodeState.Registering]: never;
  [DistributedNodeState.Idle]: DistributedNodeIdState;
  [DistributedNodeState.Running]: DistributedNodeIdState &
    DistributedNodeRunningStateWithData;
}

export type BaseDistributedNodeStateWithData<
  State extends DistributedNodeState
> = {
  state: State;
} & ExtractNonNeverProperties<{ data: DistributedNodeStateData[State] }>;

export type DistributedNodeStateWithData =
  | BaseDistributedNodeStateWithData<DistributedNodeState.Pristine>
  | BaseDistributedNodeStateWithData<DistributedNodeState.Registering>
  | BaseDistributedNodeStateWithData<DistributedNodeState.Idle>
  | BaseDistributedNodeStateWithData<DistributedNodeState.Running>;
