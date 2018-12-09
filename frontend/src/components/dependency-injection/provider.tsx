import React, { Component } from 'react';

import DIContext, { DependenciesMap } from './context';

export type DependenciesProvider<
  Dependencies extends DependenciesMap
> = () => Dependencies;

export interface DependencyInjectionProviderProps {
  provideDependencies: DependenciesProvider<any>;
}

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
