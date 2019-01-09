import { config } from 'product-specific';

import { KeepAliveServiceDependencies } from './types';

// Represented in miliseconds.
const POLLING_INTERVAL = 30 * 1000;

/**
 * A service that sends keep-alive messages to the server.
 */
export class KeepAliveService {
  private readonly fetch: KeepAliveServiceDependencies['fetch'];
  private timeoutId: number | null = null;

  public get isPolling() {
    return this.timeoutId !== null;
  }

  constructor(dependencies: KeepAliveServiceDependencies) {
    this.fetch = dependencies.fetch;
  }

  /**
   * Sends a single keep-alive message
   *
   * @param distributedNodeId
   */
  public sendKeepAlive(distributedNodeId: string): Promise<boolean> {
    const { fetch } = this;

    return fetch(
      `${config.serverUrl}/distributed-nodes/${distributedNodeId}/keep-alive`,
      {
        method: 'POST',
      },
    ).then((response) => {
      if (!response.ok) {
        return Promise.reject<boolean>('Keep alive request failed');
      }

      return response.ok;
    });
  }

  /**
   * Starts sending keep-alive messages every once in a while
   * @param distributedNodeId
   */
  public startPolling(distributedNodeId: string) {
    /**
     * NOTE: set some `timeoutId` so `isPolling` returns a correct value
     */
    this.timeoutId = 0;

    this.sendKeepAliveWithPolling(distributedNodeId)();
  }

  public stopPolling() {
    if (this.timeoutId === null) {
      throw new Error('The service is not polling yet');
    }

    clearTimeout(this.timeoutId);
    this.timeoutId = null;
  }

  private sendKeepAliveWithPolling = (
    distributedNodeId: string,
  ) => async () => {
    try {
      await this.sendKeepAlive(distributedNodeId);
    } catch (error) {
      // NOOP
    }

    this.queueNextRequest(distributedNodeId);
  };

  private queueNextRequest = (distributedNodeId: string) => {
    /**
     * NOTE: use `window.setTimeout` becuase `@types/node` override the type of `setTimeout`
     * and use a return type that is incompatible with the browser.
     */
    this.timeoutId = window.setTimeout(
      this.sendKeepAliveWithPolling(distributedNodeId),
      POLLING_INTERVAL,
    );
  };
}
