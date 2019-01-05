import pathToRegexp from 'path-to-regexp';

/**
 * Returns a function that tests whether the URL matches the route provided.
 * @param route
 */
export function urlMatchesRoute(route: string) {
  const routeRegExp = pathToRegexp(route);

  return (url: string) => routeRegExp.test(url);
}
