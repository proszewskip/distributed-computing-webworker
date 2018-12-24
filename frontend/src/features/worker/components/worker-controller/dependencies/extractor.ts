import { DependenciesExtractor } from 'components/dependency-injection/with-dependencies';

import { BaseDependencies } from 'product-specific';

import { WorkerControllerDependencies } from './types';

export const dependenciesExtractor: DependenciesExtractor<
  BaseDependencies & WorkerControllerDependencies,
  WorkerControllerDependencies
> = ({ distributedNodeServiceFactory }) => ({ distributedNodeServiceFactory });
