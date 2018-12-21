import { transformRequestError } from 'error-handling';
import Kitsu, { GetParams } from 'kitsu';
import { NextComponentClass } from 'next';
import { prop, sortBy } from 'ramda';

import {
  handleAuthenticationErrorFactory,
  redirectToLoginPage,
} from 'features/authentication';

import { DistributedTaskDetailsProps } from './types';

import { DistributedTask } from 'models';

import { routes } from '../../../../routes';

type GetInitialPropsFn = NextComponentClass<
  DistributedTaskDetailsProps
>['getInitialProps'];

export const getDistributedTaskDetailsInitialProps = (
  kitsu: Kitsu,
): GetInitialPropsFn => ({ query, res }) => {
  const id = parseInt(query.id as string, 10);

  const getParams: GetParams = {
    include: 'subtasks',
  };

  const handleAuthenticationError = handleAuthenticationErrorFactory<
    DistributedTaskDetailsProps
  >(redirectToLoginPage({ res, router: routes.Router }));

  return kitsu
    .get<DistributedTask>(`distributed-task/${id}`, getParams)
    .then((jsonApiResponse) => jsonApiResponse.data as any)
    .then((data) => {
      // NOTE: API does not allow to sort included elements
      data.subtasks = sortBy(prop('sequence-number'))(data.subtasks);
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
    .catch(handleAuthenticationError)
    .catch((error) => ({
      distributedTaskDefinitionId: id,
      errors: transformRequestError(error),
    }));
};
