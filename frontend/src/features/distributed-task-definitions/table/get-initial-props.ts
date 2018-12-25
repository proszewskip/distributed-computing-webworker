import Kitsu from 'kitsu';

import { DistributedTaskDefinition } from 'models';

import { AppPageComponentType } from 'product-specific';

import { transformRequestError } from 'error-handling';

import { getEntities } from 'utils/table/get-entities';

import { distributedTaskDefinitionModelName } from './common';
import { DistributedTaskDefinitionsTableOwnProps } from './types';

type GetInitialPropsFn = AppPageComponentType<
  DistributedTaskDefinitionsTableOwnProps
>['getInitialProps'];

export const getDistributedTaskDefinitionsTableInitialProps = (
  kitsu: Kitsu,
): NonNullable<GetInitialPropsFn> => ({ handleAuthenticationError }) => {
  return getEntities<DistributedTaskDefinition>(
    kitsu,
    distributedTaskDefinitionModelName,
  )
    .catch(handleAuthenticationError)
    .catch(
      (error): DistributedTaskDefinitionsTableOwnProps => ({
        data: [],
        totalRecordsCount: 0,
        dataFetchingError: transformRequestError(error),
      }),
    );
};
