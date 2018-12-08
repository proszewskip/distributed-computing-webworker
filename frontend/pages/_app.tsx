import App, { Container, NextAppContext } from 'next/app';
import * as PropTypes from 'prop-types';
import React from 'react';

import { routes } from '../routes';

export default class CustomApp extends App {
  public static childContextTypes = {
    router: PropTypes.object,
  };

  public static async getInitialProps({ Component, ctx }: NextAppContext) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  public getChildContext() {
    return {
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
