import { Router } from 'next-routes';
import App, { Container, NextAppContext } from 'next/app';
import React, { ChildContextProvider, ComponentClass } from 'react';

import { appContextFactory } from 'product-specific/app-context';

import { routes } from '../routes';

interface AppProps {
  headManager: any;
}

interface ProvidedContext extends AppProps {
  router: Router;
}

export default class CustomApp extends App<AppProps>
  implements ChildContextProvider<ProvidedContext> {
  public static childContextTypes = (App as ComponentClass).childContextTypes;

  public static async getInitialProps({ Component, ctx }: NextAppContext) {
    let pageProps = {};

    if (Component.getInitialProps) {
      const augmentedCtx = appContextFactory(ctx);
      pageProps = await Component.getInitialProps(augmentedCtx);
    }

    return { pageProps };
  }

  public getChildContext(): ProvidedContext {
    return {
      headManager: this.props.headManager,
      router: routes.Router,
    };
  }

  public render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  }
}
