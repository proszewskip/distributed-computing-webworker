import { KitsuOptions } from 'kitsu';
import { NextContext } from 'next';

import {
  forwardCookies,
  handleAuthenticationErrorFactory,
  redirectToLoginPage,
} from 'product-specific/authentication';
import { kitsuFactory } from 'product-specific/kitsu';
import { serverUrlProvider } from 'product-specific/server-url-provider';

import { AppContext } from './types';

import { routes } from '../../../routes';

export const appContextFactory = (
  nextContext: NextContext<any>,
): AppContext<any> => {
  const { req, res } = nextContext;
  const { Router } = routes;
  const additionalHeaders: Record<string, string> = {};

  const kitsuOptions: KitsuOptions = {
    baseURL: serverUrlProvider(req),
    headers: additionalHeaders,
  };

  forwardCookies(additionalHeaders, req);

  const handleAuthenticationError = handleAuthenticationErrorFactory(
    redirectToLoginPage({ res, router: Router }),
  );

  return {
    ...nextContext,
    handleAuthenticationError,
    kitsuFactory: (additionalOptions = {}) =>
      kitsuFactory({ ...kitsuOptions, ...additionalOptions }),
  };
};
