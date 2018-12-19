import { transformRequestError } from 'error-handling';
import Kitsu, { GetParams } from 'kitsu';
import { NextComponentClass } from 'next';

import { DistributedTaskDetailsProps } from './types';

import { DistributedTask, Subtask } from 'models';

type GetInitialPropsFn = NextComponentClass<
  DistributedTaskDetailsProps
>['getInitialProps'];

export const getDistributedTaskDetailsInitialProps = (
  kitsu: Kitsu,
): GetInitialPropsFn => ({ query }) => {
  const id = parseInt(query.id as string, 10);

  const getParams: GetParams = {
    include: 'subtasks',
  };

  return kitsu
    .get<DistributedTask>(`distributed-task/${id}`, getParams)
    .then((jsonApiResponse) => jsonApiResponse.data as any)
    .then((data) => {
      data.subtasks = data.subtasks.sort(
        (a: Subtask, b: Subtask) => a['sequence-number'] - b['sequence-number'],
      );
      return data;
    })
    .then((data) => {
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
        },
        tableData: {
          data: data.subtasks,
          totalRecordsCount: data.subtasks.length,
          distributedTaskId: data.id,
        },
      };
    })
    .catch((error) => ({
      distributedTaskDefinitionId: id,
      errors: transformRequestError(error),
    }));
};
