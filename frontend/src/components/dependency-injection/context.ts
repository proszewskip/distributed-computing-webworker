import { createContext } from 'react';

export interface DependenciesMap {
  [diToken: string]: any;
}

export default createContext<DependenciesMap | null>(null);
