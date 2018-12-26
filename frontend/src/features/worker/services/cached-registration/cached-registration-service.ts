import { CachedRegistrationServiceDependencies } from './types';

/**
 * Key in the `localStorage` that holds cached distributed node id.
 */
const DISTRIBUTED_NODE_ID_KEY = 'distributedNodeId';

export class CachedRegistrationService {
  private readonly dependencies: CachedRegistrationServiceDependencies;

  constructor(dependencies: CachedRegistrationServiceDependencies) {
    this.dependencies = dependencies;
  }

  /**
   * Registers the node and returns its id while caching it.
   *
   * Next time this method is called the cached value will be checked if still is valid
   * and possibly reused.
   */
  public registerNode(): Promise<string> {
    return this.tryReusingCachedId()
      .catch(() => this.dependencies.registrationService.registerNode())
      .then((distributedNodeId: string) => {
        this.saveDistributedNodeId(distributedNodeId);

        return distributedNodeId;
      });
  }

  private tryReusingCachedId(): Promise<string> {
    const distributedNodeId = this.loadDistributedNodeId();

    if (!distributedNodeId) {
      return Promise.reject('Distributed node id is not in the cache');
    }

    return this.dependencies.keepAliveService
      .sendKeepAlive(distributedNodeId)
      .then(() => distributedNodeId);
  }

  private saveDistributedNodeId(distributedNodeId: string) {
    this.dependencies
      .storageProvider()
      .setItem(DISTRIBUTED_NODE_ID_KEY, distributedNodeId);
  }

  private loadDistributedNodeId() {
    return this.dependencies.storageProvider().getItem(DISTRIBUTED_NODE_ID_KEY);
  }
}
