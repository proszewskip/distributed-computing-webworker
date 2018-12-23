import Kitsu from 'kitsu';

import { transformRequestError } from 'error-handling';
import { DistributedTaskDefinition } from 'models';
import { AppPageComponentType } from 'product-specific';

import { fetchDistributedTasksWithDefinitions } from 'features/distributed-tasks';

import { DistributedTaskDefinitionDetailsOwnProps } from './types';

type GetInitialPropsFn = AppPageComponentType<
  DistributedTaskDefinitionDetailsOwnProps
>['getInitialProps'];

export const getDistributedTaskDefinitionDetailsInitialProps = (
  kitsu: Kitsu,
): NonNullable<GetInitialPropsFn> => ({ query, handleAuthenticationError }) => {
  const distributedTaskDefinitionId = parseInt(query.id as string, 10);

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
