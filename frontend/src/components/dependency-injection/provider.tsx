import React, { Component } from 'react';

import DIContext, { DependenciesMap } from './context';

export type DependenciesProvider<
  Dependencies extends DependenciesMap
> = () => Dependencies;

export interface DependencyInjectionProviderProps {
  provideDependencies: DependenciesProvider<any>;
}

/**
 * A provider of the dependency injection context. Injects some initial dependencies into the
 * context. The initial dependencies to be provided are customizable by the `provideDependencies`
 * property.
 */
export class DependencyInjectionProvider extends Component<
  DependencyInjectionProviderProps
> {
  private readonly dependenciesMap = this.props.provideDependencies();

  public render() {
    return (
      <DIContext.Provider value={this.dependenciesMap}>
        {this.props.children}
      </DIContext.Provider>
    );
  }
}
