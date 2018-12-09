import React from 'react';
import renderer from 'react-test-renderer';

import DIContext from './context';
import { DependenciesProvider, DependencyInjectionProvider } from './provider';

describe('DependencyInjectionProvider', () => {
  interface AllDependencies {
    fooDependency: string;
    bar: number;
  }

  let provideDependencies: DependenciesProvider<AllDependencies>;

  beforeEach(() => {
    provideDependencies = () => ({
      fooDependency: 'Hello',
      bar: 42,
    });
  });

  it('should call dependenciesProvider once', () => {
    const mockProvideDependencies: typeof provideDependencies = jest.fn(
      provideDependencies,
    );

    renderer.create(
      <DependencyInjectionProvider
        provideDependencies={mockProvideDependencies}
      />,
    );

    expect(mockProvideDependencies).toHaveBeenCalledTimes(1);
  });

  it('should insert the provided dependencies in the context', () => {
    let providedDependencies: AllDependencies | null = null;

    renderer.create(
      <DependencyInjectionProvider provideDependencies={provideDependencies}>
        <DIContext.Consumer>
          {(dependencies) => {
            providedDependencies = dependencies as AllDependencies;

            return null;
          }}
        </DIContext.Consumer>
      </DependencyInjectionProvider>,
    );

    expect(providedDependencies).toBeDefined();
    expect(providedDependencies).toEqual(provideDependencies());
  });
});
