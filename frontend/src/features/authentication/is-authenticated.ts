import unfetch from 'isomorphic-unfetch';

import { config } from 'product-specific';

interface IsAuthenticatedResponseBody {
  isSignedIn: boolean;
}

export async function isAuthenticated(
  fetch: typeof unfetch,
  headers?: Record<string, string>,
) {
  return fetch(`http://localhost${config.serverUrl}/users/is-authenticated`, {
    headers,
  })
    .then((response) => response.json())
    .then((body: IsAuthenticatedResponseBody) => body.isSignedIn);
}
