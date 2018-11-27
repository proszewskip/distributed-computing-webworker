import React, { Component, ReactNode } from 'react';

import DIContext, { DependenciesMap } from './context';

export type DependenciesEnhancer = (
  existingDependencies: DependenciesMap,
) => DependenciesMap;

export interface DependencyInjectionEnhancerProps {
  enhanceDependencies: DependenciesEnhancer;
}

export class DependencyInjectionEnhancer extends Component<
  DependencyInjectionEnhancerProps
> {
  public render() {
    return <DIContext.Consumer children={this.renderEnhancedDependencies} />;
  }

  private renderEnhancedDependencies = (
    existingDependencies: DependenciesMap | null,
  ): ReactNode => {
    if (!existingDependencies) {
      // tslint:disable-next-line:no-console
      console.error(
        'DependencyInjectionEnhancer cannot be used when there are no provided dependencies',
      );

      return null;
    }

    const enhancedDependencies = this.props.enhanceDependencies(
      existingDependencies,
    );

    return (
      <DIContext.Provider value={enhancedDependencies}>
        {this.props.children}
      </DIContext.Provider>
    );
  };
}
