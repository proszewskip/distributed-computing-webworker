import Kitsu from 'kitsu';

import { DistributedTaskDefinition } from 'models';

import { AppPageComponentType } from 'product-specific';

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
  ).catch(handleAuthenticationError);
};
