import pathToRegexp from 'path-to-regexp';

export function urlMatchesRoute(route: string) {
  const routeRegExp = pathToRegexp(route);

  return (url: string) => routeRegExp.test(url);
}
