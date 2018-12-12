import Kitsu from 'kitsu';
import { NextComponentClass } from 'next';

import { transformRequestError } from 'error-handling';
import { DistributedTaskDefinition } from 'models';

import { DistributedTaskDefinitionDetailsInitialProps } from './types';

type GetInitialPropsFn = NextComponentClass<
  DistributedTaskDefinitionDetailsInitialProps
>['getInitialProps'];

export const getDistributedTaskDefinitionDetailsInitialProps = (
  kitsu: Kitsu,
): GetInitialPropsFn => ({ query }) => {
  const id = parseInt(query.id as string, 10);

  return kitsu
    .get<DistributedTaskDefinition>(`distributed-task-definition/${id}`)
    .then((result) => ({
      id,
      data: result.data as DistributedTaskDefinition,
    }))
    .catch(
      (error): DistributedTaskDefinitionDetailsInitialProps => ({
        id,
        error: transformRequestError(error),
      }),
    );
};
