import Kitsu from 'kitsu';
import { NextComponentClass } from 'next';

import { transformRequestError } from 'error-handling';
import { DistributedTask } from 'models';

import { DistributedTaskDetailsInitialProps } from './types';

type GetInitialPropsFn = NextComponentClass<
  DistributedTaskDetailsInitialProps
>['getInitialProps'];

export const getDistributedTaskDefinitionDetailsInitialProps = (
  kitsu: Kitsu,
): GetInitialPropsFn => ({ query }) => {
  const id = parseInt(query.id as string, 10);

  return kitsu
    .get<DistributedTask>(`distributed-task/${id}`)
    .then((result) => ({
      id,
      data: result.data as DistributedTask,
    }))
    .catch(
      (error): DistributedTaskDetailsInitialProps => ({
        id,
        error: transformRequestError(error),
      }),
    );
};
