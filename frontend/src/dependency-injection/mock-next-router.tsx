import React from 'react';

interface MockNextContextProps {
  headManager?: object;
  router?: object;
}

export default class MockNextContext extends React.Component<
  MockNextContextProps
> {
  public static childContextTypes = {
    headManager: {},
    router: {},
  };

  public getChildContext() {
    const { headManager, router } = this.props;
    return {
      headManager: {
        updateHead: () => null,
        ...headManager,
      },
      router: {
        asPath: '/',
        route: '/',
        pathname: '/',
        query: {},
        // TODO: Properly mock the following methods
        back: () => null,
        beforePopState: () => null,
        prefetch: () => null,
        push: () => null,
        reload: () => null,
        replace: () => null,
        events: {
          // TODO: Implement EventEmitter
          on: () => null,
          off: () => null,
          trigger: () => null,
        },
        ...router,
      },
    };
  }

  public render() {
    return this.props.children;
  }
}
