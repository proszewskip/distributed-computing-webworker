import React, { Component, ReactNode } from 'react';

import DIContext, { DependenciesMap } from './context';

export type DependenciesEnhancer<
  InitialDependencies extends DependenciesMap,
  EnhancedDependencies extends DependenciesMap
> = (initialDependencies: InitialDependencies) => EnhancedDependencies;

export interface DependencyInjectionEnhancerProps {
  enhanceDependencies: DependenciesEnhancer<any, any>;
}

export class DependencyInjectionEnhancer extends Component<
  DependencyInjectionEnhancerProps
> {
  public render() {
    return <DIContext.Consumer children={this.renderEnhancedDependencies} />;
  }

  private renderEnhancedDependencies = (
    initialDependencies: DependenciesMap | null,
  ): ReactNode => {
    if (!initialDependencies) {
      // tslint:disable-next-line:no-console
      console.error(
        'DependencyInjectionEnhancer cannot be used when there are no provided dependencies',
      );

      return null;
    }

    const enhancedDependencies = this.props.enhanceDependencies(
      initialDependencies,
    );

    return (
      <DIContext.Provider value={enhancedDependencies}>
        {this.props.children}
      </DIContext.Provider>
    );
  };
}
