import unfetch from 'isomorphic-unfetch';

/**
 * Logs the user out.
 *
 * @param fetch
 */
export const logout = (fetch: typeof unfetch) =>
  fetch('/users/logout', {
    method: 'POST',
  }).catch(() => null);
