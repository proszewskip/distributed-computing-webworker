import { IncomingMessage } from 'http';

import { config } from 'product-specific/config';

/**
 * Returns the URL of the application server.
 *
 * @param req
 */
export const serverUrlProvider = (req?: IncomingMessage) => {
  const { serverUrl } = config;

  const isClientside = !req;
  const serverUrlIsAbsolute = !serverUrl.startsWith('/');

  if (isClientside || serverUrlIsAbsolute) {
    return serverUrl;
  }

  /**
   * NOTE: Typescript does not detect that `req` must be defined as checked in the `if` above
   */
  return getServersideServerUrl(req as IncomingMessage);
};

const getServersideServerUrl = (req: IncomingMessage) => {
  if (process.env.NODE_ENV === 'production') {
    return config.productionServerUrl;
  }

  /**
   * NOTE: The `req` object injected by Next.js contains the following properties
   * but the base type does not.
   */
  // @ts-ignore
  return `${req.protocol}://${req.get('Host')}${config.serverUrl}`;
};
