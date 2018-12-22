import { IncomingMessage } from 'http';

import { config } from 'product-specific/config';

export const isomorphicGetBaseUrl = (req?: IncomingMessage) =>
  `${getPrefix(req)}${config.serverUrl}`;

function getPrefix(req?: IncomingMessage) {
  if (!req) {
    return '';
  }

  // @ts-ignore
  return `${req.protocol}://${req.get('Host')}`;
}
