import unfetch from 'isomorphic-unfetch';

interface IsAuthenticatedResponseBody {
  isSignedIn: boolean;
}

/**
 * Tests is the user is authenticated.
 *
 * @param fetch
 */
export function isAuthenticated(fetch: typeof unfetch) {
  return fetch('/users/is-authenticated')
    .then(
      (response) =>
        response.ok
          ? Promise.resolve(response)
          : Promise.reject('Error while connecting to the server'),
    )
    .then((response) => response.json())
    .then((body: IsAuthenticatedResponseBody) => body.isSignedIn);
}
