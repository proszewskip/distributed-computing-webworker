import React, { Component, ComponentType, ReactNode } from 'react';

import { Subtract } from 'types/subtract';
import { getDisplayName } from 'utils/get-display-name';

import DIContext, { DependenciesMap } from './context';

export type DependenciesExtractor<
  Dependencies extends DependenciesMap,
  InjectedProps extends DependenciesMap
> = (dependencies: Dependencies) => InjectedProps;

export const withDependencies = <
  Dependencies extends DependenciesMap,
  InjectedProps
>(
  dependenciesExtractor: DependenciesExtractor<Dependencies, InjectedProps>,
) => <Props extends InjectedProps>(WrappedComponent: ComponentType<Props>) => {
  type WithDependenciesProps = Subtract<Props, InjectedProps>;

  class WithDependencies extends Component<WithDependenciesProps> {
    public static displayName = `withDependencies(${getDisplayName(
      WrappedComponent,
    )})`;

    public render() {
      return <DIContext.Consumer children={this.injectDependencies} />;
    }

    private injectDependencies = (
      allDependencies: DependenciesMap | null,
    ): ReactNode => {
      if (!allDependencies) {
        // tslint:disable-next-line:no-console
        console.error(
          `No dependencies provider found for component ${getDisplayName(
            WrappedComponent,
          )}`,
        );

        return null;
      }

      const extractedDependencies = dependenciesExtractor(
        allDependencies as Dependencies,
      );

      return <WrappedComponent {...extractedDependencies} {...this.props} />;
    };
  }

  return WithDependencies;
};
