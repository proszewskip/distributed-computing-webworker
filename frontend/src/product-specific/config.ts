export const config = {
  /**
   * `serverUrl` is safe to use only client-side as it does not contain the server hostname
   * Use `serverUrlProvider` for an isomorphic URL (safe to use in both environments)
   */
  serverUrl: '/api',

  /**
   * Server URL when the app runs in production (as a Docker container)
   */
  productionServerUrl: 'http://backend:5000',

  loginPageUrl: '/authentication/login',
};
