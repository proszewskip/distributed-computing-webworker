import { NextComponentType, NextContext } from 'next';
import { DefaultQuery } from 'next/router';

import { HandleAuthenticationErrorFn } from 'product-specific/authentication';
import { KitsuFactory } from 'product-specific/kitsu';

export interface AppContext<Q extends DefaultQuery = DefaultQuery>
  extends NextContext<Q> {
  handleAuthenticationError: HandleAuthenticationErrorFn<any>;

  /**
   * Contains augmented headers and baseURL so that authentication also works server-side
   */
  kitsuFactory: KitsuFactory;
}

export type AppPageComponentType<
  Props,
  InitialProps = Props
> = NextComponentType<Props, InitialProps, AppContext>;
