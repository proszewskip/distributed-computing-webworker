import Kitsu from 'kitsu';
import { NextComponentClass } from 'next';

import { transformRequestError } from 'error-handling';
import { DistributedTaskDefinition } from 'models';

import {
  handleAuthenticationErrorFactory,
  redirectToLoginPage,
} from 'features/authentication';
import { fetchDistributedTasksWithDefinitions } from 'features/distributed-tasks';

import { DistributedTaskDefinitionDetailsOwnProps } from './types';

import { routes } from '../../../../routes';

type GetInitialPropsFn = NextComponentClass<
  DistributedTaskDefinitionDetailsOwnProps
>['getInitialProps'];

export const getDistributedTaskDefinitionDetailsInitialProps = (
  kitsu: Kitsu,
): NonNullable<GetInitialPropsFn> => ({ query, res }) => {
  const distributedTaskDefinitionId = parseInt(query.id as string, 10);

  const handleAuthenticationError = handleAuthenticationErrorFactory<
    DistributedTaskDefinitionDetailsOwnProps
  >(redirectToLoginPage({ res, router: routes.Router }));

  const tableDataPromise = fetchDistributedTasksWithDefinitions(
    kitsu,
    distributedTaskDefinitionId,
  );
  const detailsDataPromise = kitsu
    .get<DistributedTaskDefinition>(
      `distributed-task-definition/${distributedTaskDefinitionId}`,
    )
    .then(
      (result): DistributedTaskDefinitionDetailsOwnProps => ({
        id: distributedTaskDefinitionId,
        detailsData: result.data as DistributedTaskDefinition,
      }),
    );

  return Promise.all([tableDataPromise, detailsDataPromise])
    .then(
      ([tableData, detailsData]): DistributedTaskDefinitionDetailsOwnProps => ({
        ...detailsData,
        tableData,
      }),
    )
    .catch(handleAuthenticationError)
    .catch(
      (error): DistributedTaskDefinitionDetailsOwnProps => ({
        id: distributedTaskDefinitionId,
        error: transformRequestError(error),
      }),
    );
};
