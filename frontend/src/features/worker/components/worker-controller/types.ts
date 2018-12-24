import {
  DistributedNodeService,
  DistributedNodeStateWithData,
} from 'features/worker/services';

import { WorkerControllerDependencies } from './dependencies';

export type PureWorkerControllerProps = WorkerControllerDependencies;

export interface WorkerControllerState {
  distributedNodeService?: DistributedNodeService;
  distributedNodeState?: DistributedNodeStateWithData;
  threadsCount: number;
}
