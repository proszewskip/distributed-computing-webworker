import unfetch from 'isomorphic-unfetch';
import { NextComponentType, NextContext } from 'next';
import { DefaultQuery } from 'next/router';

import { HandleAuthenticationErrorFn } from 'product-specific/authentication';
import { Redirect } from 'product-specific/isomorphic-redirect';
import { KitsuFactory } from 'product-specific/kitsu';

export interface AppContext<Q extends DefaultQuery = DefaultQuery>
  extends NextContext<Q> {
  handleAuthenticationError: HandleAuthenticationErrorFn<any>;

  /**
   * Contains augmented headers and baseURL so that authentication also works server-side
   */
  kitsuFactory: KitsuFactory;

  /**
   * Server URL that is safe to use server-side and client-side
   */
  serverUrl: string;

  /**
   * Safe to use server-side and client-side. Injects headers and server URL so that authentication
   * works.
   */
  fetch: typeof unfetch;

  /**
   * Isomorphic redirect
   */
  redirect: Redirect;
}

export type AppPageComponentType<
  Props,
  InitialProps = Props
> = NextComponentType<Props, InitialProps, AppContext>;
