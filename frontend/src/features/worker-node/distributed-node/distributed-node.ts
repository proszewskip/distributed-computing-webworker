import { DistributedNodeDependencies } from './types';

export class DistributedNode {
  private readonly dependencies: DistributedNodeDependencies;
  private threadsCount = 1;

  constructor(dependencies: DistributedNodeDependencies) {
    this.dependencies = dependencies;
  }

  public setThreadsCount(threadsCount: number) {
    if (threadsCount < 1) {
      throw new Error('Cannot set threads count to less than 1');
    }

    this.threadsCount = threadsCount;
    // TODO: try to start new SubtaskWorkers or kill existing ones
  }
}
