import React, { StatelessComponent } from 'react';
import renderer from 'react-test-renderer';

import { DependenciesProvider, DependencyInjectionProvider } from './provider';
import { DependenciesExtractor, withDependencies } from './with-dependencies';
import { mockConsole } from 'utils/mock-console';

describe('withDependencies', () => {
  interface AllDependencies {
    fooDependency: string;
    bar: number;
  }

  type ComponentProps = Pick<AllDependencies, 'fooDependency'> & {
    someOtherProp: string;
  };

  type InjectedProps = Pick<ComponentProps, 'fooDependency'>;

  let provideDependencies: DependenciesProvider<AllDependencies>;
  let TestComponent: StatelessComponent<ComponentProps>;
  let extractDependencies: DependenciesExtractor<
    AllDependencies,
    InjectedProps
  >;

  beforeEach(() => {
    provideDependencies = () => ({
      fooDependency: 'Hello',
      bar: 42,
    });

    TestComponent = ({ fooDependency }) => {
      return <div>{fooDependency}</div>;
    };

    extractDependencies = (dependencies) => ({
      fooDependency: dependencies.fooDependency,
    });
  });

  describe('when there are dependencies provided', () => {
    it('should call dependenciesExtractor once', () => {
      const mockDependenciesExtractor: DependenciesExtractor<
        AllDependencies,
        InjectedProps
      > = jest.fn(extractDependencies);

      const TestComponentWithDependencies = withDependencies(
        mockDependenciesExtractor,
      )(TestComponent);

      renderer.create(
        <DependencyInjectionProvider provideDependencies={provideDependencies}>
          <TestComponentWithDependencies someOtherProp="other prop" />
        </DependencyInjectionProvider>,
      );

      expect(mockDependenciesExtractor).toHaveBeenCalledTimes(1);
      expect(mockDependenciesExtractor).toHaveBeenCalledWith(
        jasmine.objectContaining(provideDependencies()),
      );
    });

    it('should inject dependencies', () => {
      const TestComponentWithDependencies = withDependencies(
        extractDependencies,
      )(TestComponent);

      const component = renderer.create(
        <DependencyInjectionProvider provideDependencies={provideDependencies}>
          <TestComponentWithDependencies someOtherProp="other prop" />
        </DependencyInjectionProvider>,
      );

      const renderedContent = component.root.find(
        (node) => node.type === 'div',
      );

      expect(renderedContent.children[0]).toBe(
        provideDependencies().fooDependency,
      );
    });
  });

  describe('when there are no dependencies provided', () => {
    mockConsole();

    it('should not render the component when there are no dependencies provided', () => {
      const TestComponentWithDependencies = withDependencies(
        extractDependencies,
      )(TestComponent);

      const component = renderer.create(
        <TestComponentWithDependencies someOtherProp="other prop" />,
      );

      const renderedContent = component.root.findAll(
        (node) => node.type === 'div',
      );

      expect(renderedContent).toHaveLength(0);
    });

    it('should not call dependenciesExtractor', () => {
      const mockDependenciesExtractor: DependenciesExtractor<
        AllDependencies,
        InjectedProps
      > = jest.fn(extractDependencies);

      const TestComponentWithDependencies = withDependencies(
        mockDependenciesExtractor,
      )(TestComponent);

      renderer.create(
        <TestComponentWithDependencies someOtherProp="other prop" />,
      );

      expect(mockDependenciesExtractor).not.toHaveBeenCalled();
    });
  });
});
