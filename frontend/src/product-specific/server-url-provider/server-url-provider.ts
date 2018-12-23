import { IncomingMessage } from 'http';

import { config } from 'product-specific/config';

export const serverUrlProvider = (req?: IncomingMessage) => {
  const { serverUrl } = config;

  const isClientSide = !req;
  const serverUrlIsAbsolute = !serverUrl.startsWith('/');

  if (isClientSide || serverUrlIsAbsolute) {
    return serverUrl;
  }

  /**
   * NOTE: The `req` object injected by Next.js contains the following properties
   * but the base type does not.
   */
  // @ts-ignore
  return `${req.protocol}://${req.get('Host')}${serverUrl}`;
};
