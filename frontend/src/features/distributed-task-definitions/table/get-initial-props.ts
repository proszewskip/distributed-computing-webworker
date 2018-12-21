import Kitsu from 'kitsu';
import { NextComponentClass } from 'next';

import { DistributedTaskDefinition } from 'models';

import {
  handleAuthenticationErrorFactory,
  redirectToLoginPage,
} from 'features/authentication';

import { getEntities } from 'utils/table/get-entities';

import { distributedTaskDefinitionModelName } from './common';
import { DistributedTaskDefinitionsTableOwnProps } from './types';

import { routes } from '../../../../routes';

type GetInitialPropsFn = NextComponentClass<
  DistributedTaskDefinitionsTableOwnProps
>['getInitialProps'];

export const getDistributedTaskDefinitionsTableInitialProps = (
  kitsu: Kitsu,
): GetInitialPropsFn => ({ res }) => {
  const handleAuthenticationError = handleAuthenticationErrorFactory<
    DistributedTaskDefinitionsTableOwnProps
  >(redirectToLoginPage({ res, router: routes.Router }));

  return getEntities<DistributedTaskDefinition>(
    kitsu,
    distributedTaskDefinitionModelName,
  ).catch(handleAuthenticationError);
};
