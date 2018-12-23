import unfetch from 'isomorphic-unfetch';

interface IsAuthenticatedResponseBody {
  isSignedIn: boolean;
}

export function isAuthenticated(fetch: typeof unfetch) {
  return fetch('/users/is-authenticated')
    .then((response) => response.json())
    .then((body: IsAuthenticatedResponseBody) => body.isSignedIn);
}
