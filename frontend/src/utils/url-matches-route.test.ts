import { urlMatchesRoute } from './url-matches-route';

describe('urlMatchesRoute', () => {
  describe('for a route without parameters', () => {
    it('should return true when the url matches', () => {
      const route = '/test';
      const url = '/test';

      expect(urlMatchesRoute(route)(url)).toBe(true);
    });

    it('should return false when the url does not match', () => {
      const route = '/test';
      const url = '/other';

      expect(urlMatchesRoute(route)(url)).toBe(false);
    });
  });

  describe('for a route with parameters', () => {
    it('should return true when the url matches', () => {
      const route = '/test/:param';
      const url = '/test/1';

      expect(urlMatchesRoute(route)(url)).toBe(true);
    });

    it('should return false when the url does not match', () => {
      const route = '/test/:param';
      const url = '/test';

      expect(urlMatchesRoute(route)(url)).toBe(false);
    });
  });
});
