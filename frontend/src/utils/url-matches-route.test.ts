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

  describe('for a route with optional parameters', () => {
    let route: string;

    beforeEach(() => {
      route = '/test/:id*';
    });

    it('should return true when the url has no parameters and matches', () => {
      const url = '/test';

      expect(urlMatchesRoute(route)(url)).toBe(true);
    });

    it('should return true when the url has a parameter and matches', () => {
      const url = '/test/1';

      expect(urlMatchesRoute(route)(url)).toBe(true);
    });

    it('should return false when the url has a parameter and does not match', () => {
      const url = '/testing/1';

      expect(urlMatchesRoute(route)(url)).toBe(false);
    });
  });
});
