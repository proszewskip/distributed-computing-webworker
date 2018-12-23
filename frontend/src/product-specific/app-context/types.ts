import { NextComponentType, NextContext } from 'next';
import { DefaultQuery } from 'next/router';

import { HandleAuthenticationErrorFn } from 'product-specific/authentication';
import { KitsuFactory } from 'product-specific/kitsu';

export interface AppContext<Q extends DefaultQuery = DefaultQuery>
  extends NextContext<Q> {
  handleAuthenticationError: HandleAuthenticationErrorFn<any>;
  kitsuFactory: KitsuFactory;
}

export type AppPageComponentType<
  Props,
  InitialProps = Props
> = NextComponentType<Props, InitialProps, AppContext>;
