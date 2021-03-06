import { config } from 'product-specific';

import {
  AssignNextResponseBody,
  ComputationCancelRequestBody,
  ComputationErrorRequestBody,
  ComputationSuccessRequestBody,
  SubtaskServiceDependencies,
} from './types';

/**
 * A service that manages communication with the server regarding subtasks.
 *
 * Allows for fetching a next subtask to compute and sending computation results.
 */
export class SubtaskSerivce {
  private readonly fetch: SubtaskServiceDependencies['fetch'];

  constructor(dependencies: SubtaskServiceDependencies) {
    this.fetch = dependencies.fetch;
  }

  public assignNextTask = (
    distributedNodeId: string,
  ): Promise<AssignNextResponseBody> => {
    const { fetch } = this;

    return fetch(`${config.serverUrl}/subtasks/assign-next`, {
      method: 'POST',
      body: JSON.stringify({
        'distributed-node-id': distributedNodeId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(this.rejectIfNotOk('Cannot assign next subtask'))
      .then((response) => response.json());
  };

  public sendComputationSuccess = (
    requestBody: ComputationSuccessRequestBody,
  ) => {
    const formData = new FormData();

    formData.set('SubtaskInProgressId', requestBody.subtaskInProgressId);
    formData.set('DistributedNodeId', requestBody.distributedNodeId);
    formData.set('SubtaskResult', new Blob([requestBody.subtaskResult]));

    const { fetch } = this;

    return fetch(
      `${config.serverUrl}/subtasks-in-progress/computation-success`,
      {
        method: 'POST',
        body: formData,
      },
    ).then(this.rejectIfNotOk('Cannot report subtask computation success'));
  };

  public sendComputationError = (requestBody: ComputationErrorRequestBody) => {
    const formData = new FormData();

    formData.set('SubtaskInProgressId', requestBody.subtaskInProgressId);
    formData.set('DistributedNodeId', requestBody.distributedNodeId);
    requestBody.errors.forEach((error) => {
      formData.append('Errors', error);
    });

    const { fetch } = this;

    return fetch(`${config.serverUrl}/subtasks-in-progress/computation-error`, {
      method: 'POST',
      body: formData,
    }).then(this.rejectIfNotOk('Cannot report subtask computation error'));
  };

  public sendComputationCancel = (
    requestBody: ComputationCancelRequestBody,
  ) => {
    const { fetch } = this;

    return fetch(
      `${config.serverUrl}/subtasks-in-progress/computation-cancel`,
      {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).then(this.rejectIfNotOk('Cannot report subtask computation cancel'));
  };

  private rejectIfNotOk = (errorMessage: string) => (response: Response) => {
    if (!response.ok) {
      return Promise.reject(errorMessage);
    }

    return Promise.resolve(response);
  };
}
