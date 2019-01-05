import { transformRequestError } from 'error-handling';
import Kitsu, { GetParams } from 'kitsu';
import { prop, sortBy } from 'ramda';

import {
  DistributedTaskDetailsProps,
  DistributedTaskWithSubtasksAndDefinition,
} from './types';

import { AppPageComponentType } from 'product-specific';

type GetInitialPropsFn = AppPageComponentType<
  DistributedTaskDetailsProps
>['getInitialProps'];

export const getDistributedTaskDetailsInitialProps = (
  kitsu: Kitsu,
): NonNullable<GetInitialPropsFn> => ({ query, handleAuthenticationError }) => {
  const id = parseInt(query.id as string, 10);

  const getParams: GetParams = {
    include: 'subtasks,distributed-task-definition',
  };

  return kitsu
    .get<DistributedTaskWithSubtasksAndDefinition>(
      `distributed-task/${id}`,
      getParams,
    )
    .then(
      (jsonApiResponse) =>
        jsonApiResponse.data as DistributedTaskWithSubtasksAndDefinition,
    )
    .then(
      (data): DistributedTaskDetailsProps => {
        return {
          distributedTaskDefinitionId: id,
          detailsData: {
            id: data.id,
            name: data.name,
            description: data.description,
            priority: data.priority,
            'trust-level-to-complete': data['trust-level-to-complete'],
            errors: data.errors,
            status: data.status,
            'distributed-task-definition': data['distributed-task-definition'],
          },
          tableData: {
            // NOTE: API does not allow to sort included elements
            data: sortBy(prop('sequence-number'))(data.subtasks).slice(0, 10),
            totalRecordsCount: data.subtasks.length,
            distributedTaskId: data.id,
          },
        };
      },
    )
    .catch(handleAuthenticationError)
    .catch(
      (error): DistributedTaskDetailsProps => ({
        distributedTaskDefinitionId: id,
        dataFetchingError: transformRequestError(error),
      }),
    );
};
