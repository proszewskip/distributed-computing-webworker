import React, { Component } from 'react';

import DIContext, { DependenciesMap } from './context';

export type DependenciesProvider = () => DependenciesMap;

export interface DependencyInjectionProviderProps {
  provideDependencies: DependenciesProvider;
}

export class DependencyInjectionProvider extends Component<
  DependencyInjectionProviderProps
> {
  private readonly dependenciesMap: DependenciesMap;

  constructor(props: DependencyInjectionProviderProps) {
    super(props);

    this.dependenciesMap = props.provideDependencies();
  }

  public render() {
    return (
      <DIContext.Provider value={this.dependenciesMap}>
        {this.props.children}
      </DIContext.Provider>
    );
  }
}
