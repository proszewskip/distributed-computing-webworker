import unfetch from 'isomorphic-unfetch';

import { config } from 'product-specific';

interface IsAuthenticatedResponseBody {
  isSignedIn: boolean;
}

export async function isAuthenticated(fetch: typeof unfetch) {
  return fetch(`${config.serverUrl}/users/is-authenticated`, {
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((body: IsAuthenticatedResponseBody) => body.isSignedIn);
}
