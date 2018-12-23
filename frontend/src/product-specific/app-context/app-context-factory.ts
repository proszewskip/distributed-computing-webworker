import fetch from 'isomorphic-unfetch';
import { KitsuOptions } from 'kitsu';
import { NextContext } from 'next';

import {
  forwardCookies,
  handleAuthenticationErrorFactory,
  redirectToLoginPageFactory,
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
  const serverUrl = serverUrlProvider(req);

  const kitsuOptions: KitsuOptions = {
    baseURL: serverUrl,
    headers: additionalHeaders,
  };

  forwardCookies(additionalHeaders, req);

  const redirectToLoginPage = redirectToLoginPageFactory({
    res,
    router: Router,
  });
  const handleAuthenticationError = handleAuthenticationErrorFactory(
    redirectToLoginPage,
  );

  return {
    ...nextContext,
    handleAuthenticationError,
    kitsuFactory: (additionalOptions = {}) =>
      kitsuFactory({ ...kitsuOptions, ...additionalOptions }),
    serverUrl,
    fetch: fetchFactory(serverUrl, additionalHeaders),
    redirectToLoginPage,
  };
};

const fetchFactory = (
  serverUrl: string,
  additionalHeaders: Record<string, string>,
): typeof fetch => (
  requestInfo: RequestInfo,
  requestInit: RequestInit = {},
) => {
  if (typeof requestInfo === 'string') {
    return fetch(getIsomorphicUrl(requestInfo, serverUrl), {
      headers: {
        ...requestInit.headers,
        ...additionalHeaders,
      },
    });
  }

  const newRequestInfo: RequestInfo = {
    ...requestInfo,
    url: getIsomorphicUrl(requestInfo.url, serverUrl),
    headers: {
      ...requestInfo.headers,
      ...additionalHeaders,
    },
  };

  return fetch(newRequestInfo);
};

const getIsomorphicUrl = (url: string, serverUrl: string) => {
  const isAbsoluteUrl = url.startsWith('/');

  if (isAbsoluteUrl) {
    return `${serverUrl}${url}`;
  }

  return url;
};
