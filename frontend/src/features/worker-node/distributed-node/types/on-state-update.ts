import { DistributedNodeStateWithData } from './state';

export type OnDistributedNodeStateUpdate = (
  state: DistributedNodeStateWithData,
) => void;
