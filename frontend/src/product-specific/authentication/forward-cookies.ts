import { IncomingMessage } from 'http';

/**
 * Adds client cookies to a request that is performed server-side
 *
 * This preserves the fact that the user could be authenticated.
 * @param headers Existing request headers
 * @param req
 */
export const forwardCookies = (
  headers: Record<string, string>,
  req?: IncomingMessage,
) => {
  if (!req) {
    return;
  }

  headers.cookie = req.headers.cookie as string;
};
