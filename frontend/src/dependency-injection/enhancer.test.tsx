import React, { StatelessComponent } from 'react';
import renderer from 'react-test-renderer';

import { mockConsole } from '../../__mocks__/mock-console';

import DIContext, { DependenciesMap } from './context';
import { DependenciesEnhancer, DependencyInjectionEnhancer } from './enhancer';
import { DependenciesProvider } from './provider';

describe('DependencyInjectionEnhancer', () => {
  interface InitialDependencies {
    fooDependency: string;
    bar: number;
  }

  interface EnhancedDependencies extends InitialDependencies {
    additionalDependency: boolean;
  }

  let provideDependencies: DependenciesProvider<InitialDependencies>;
  let enhanceDependencies: DependenciesEnhancer<
    InitialDependencies,
    EnhancedDependencies
  >;

  mockConsole();

  beforeEach(() => {
    provideDependencies = () => ({
      fooDependency: 'hello',
      bar: 42,
    });

    enhanceDependencies = (initialDependencies) => ({
      ...initialDependencies,
      additionalDependency: true,
    });
  });

  describe('when the dependencies are provided', () => {
    let Provider: StatelessComponent;

    beforeEach(() => {
      Provider = ({ children }) => (
        <DIContext.Provider value={provideDependencies()}>
          {children}
        </DIContext.Provider>
      );
    });

    it('should call enhanceDependencies once with initial dependencies', () => {
      const mockEnhanceDependencies: typeof enhanceDependencies = jest.fn(
        enhanceDependencies,
      );

      renderer.create(
        <Provider>
          <DependencyInjectionEnhancer
            enhanceDependencies={mockEnhanceDependencies}
          />
        </Provider>,
      );

      expect(mockEnhanceDependencies).toHaveBeenCalledTimes(1);
      expect(mockEnhanceDependencies).toHaveBeenCalledWith(
        jasmine.objectContaining(provideDependencies()),
      );
    });

    it('should provide enhanced dependencies', () => {
      let enhancedDependencies: DependenciesMap | null = null;

      renderer.create(
        <Provider>
          <DependencyInjectionEnhancer
            enhanceDependencies={enhanceDependencies}
          >
            <DIContext.Consumer>
              {(dependencies) => {
                enhancedDependencies = dependencies;

                return <div />;
              }}
            </DIContext.Consumer>
          </DependencyInjectionEnhancer>
        </Provider>,
      );

      const expectedDependencies = enhanceDependencies(provideDependencies());

      expect(enhancedDependencies).toEqual(expectedDependencies);
    });
  });

  describe('when no dependencies are provided', () => {
    it('should render nothing', () => {
      const component = renderer.create(
        <DependencyInjectionEnhancer enhanceDependencies={enhanceDependencies}>
          <div />
        </DependencyInjectionEnhancer>,
      );

      const renderedContent = component.root.findAll(
        (node) => node.type === 'div',
      );

      expect(renderedContent).toHaveLength(0);
    });

    it('should not call enhanceDependencies', () => {
      const mockEnhanceDependencies: typeof enhanceDependencies = jest.fn(
        enhanceDependencies,
      );

      renderer.create(
        <DependencyInjectionEnhancer
          enhanceDependencies={enhanceDependencies}
        />,
      );

      expect(mockEnhanceDependencies).not.toHaveBeenCalled();
    });
  });
});
