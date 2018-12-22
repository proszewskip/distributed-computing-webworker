import Kitsu from 'kitsu';
import { NextComponentClass } from 'next';

import { DistributedTaskDefinition } from 'models';

import { getEntities } from 'utils/table/get-entities';

import { distributedTaskDefinitionModelName } from './common';
import { DistributedTaskDefinitionsTableOwnProps } from './types';

type GetInitialPropsFn = NextComponentClass<
  DistributedTaskDefinitionsTableOwnProps
>['getInitialProps'];

export const getDistributedTaskDefinitionsTableInitialProps = (
  kitsu: Kitsu,
): NonNullable<GetInitialPropsFn> => () => {
  return getEntities<DistributedTaskDefinition>(
    kitsu,
    distributedTaskDefinitionModelName,
  );
};
