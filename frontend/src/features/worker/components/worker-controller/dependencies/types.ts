import {
  DistributedNodeService,
  OnDistributedNodeStateUpdate,
} from 'features/worker/services';

export type DistributedNodeServiceFactory = (
  onDistributedNodeStateUpdate: OnDistributedNodeStateUpdate,
) => DistributedNodeService;

export interface WorkerControllerDependencies {
  distributedNodeServiceFactory: DistributedNodeServiceFactory;
}
