import unfetch from 'isomorphic-unfetch';

import { config } from 'product-specific';

export const logout = (fetch: typeof unfetch) =>
  fetch(`${config.serverUrl}/users/logout`, {
    method: 'POST',
  }).catch(() => null);
