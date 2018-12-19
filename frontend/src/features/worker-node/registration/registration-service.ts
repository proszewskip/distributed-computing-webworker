import { config } from 'product-specific';

import { RegisterResponseBody, RegistrationServiceDependencies } from './types';

export class RegistrationService {
  private readonly fetch: GlobalFetch['fetch'];

  constructor(dependencies: RegistrationServiceDependencies) {
    this.fetch = dependencies.fetch;
  }

  /**
   * Registers the node and the newly received ID
   */
  public registerNode() {
    return this.fetch(`${config.serverUrl}/distributed-nodes/register`, {
      method: 'POST',
    })
      .then((response) => {
        if (!response.ok) {
          return Promise.reject('Cannot register the node');
        }

        return response.json();
      })
      .then((body: RegisterResponseBody) => body.data.attributes.id);
  }
}
