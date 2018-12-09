import React, { StatelessComponent } from 'react';

import {
  DependenciesProvider,
  DependencyInjectionProvider,
} from 'components/dependency-injection/provider';

import { kitsuFactory } from 'product-specific/kitsu';

import { BaseDependencies } from './types';

const provideDependencies: DependenciesProvider<BaseDependencies> = () => ({
  kitsu: kitsuFactory(),
});

export const BaseDependenciesProvider: StatelessComponent = ({ children }) => (
  <DependencyInjectionProvider provideDependencies={provideDependencies}>
    {children}
  </DependencyInjectionProvider>
);
