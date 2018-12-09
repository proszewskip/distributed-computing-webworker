import Kitsu from 'kitsu';
import { NextComponentClass } from 'next';

import { DistributedTaskDefinition } from 'models';

import { transformRequestError } from 'error-handling';

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
      data: result.data,
    }))
    .catch(
      (error): DistributedTaskDefinitionDetailsInitialProps => ({
        id,
        error: transformRequestError(error),
      }),
    );
};
