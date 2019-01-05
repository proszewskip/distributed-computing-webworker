import unfetch from 'isomorphic-unfetch';
import React, { StatelessComponent } from 'react';

import {
  DependenciesProvider,
  DependencyInjectionProvider,
} from 'components/dependency-injection/provider';

import { kitsuFactory } from 'product-specific/kitsu';

import { BaseDependencies } from './types';

const provideDependencies: DependenciesProvider<BaseDependencies> = () => ({
  kitsu: kitsuFactory(),
  fetch: unfetch,
});

/**
 * Provides base dependencies used throughout the application.
 */
export const BaseDependenciesProvider: StatelessComponent = ({ children }) => (
  <DependencyInjectionProvider provideDependencies={provideDependencies}>
    {children}
  </DependencyInjectionProvider>
);
