import { IncomingMessage } from 'http';
import { forwardCookies } from './forward-cookies';

describe('forwardCookies', () => {
  it('should forward cookies when they are present', () => {
    const headers: Record<string, string> = {};
    const req: IncomingMessage = {
      headers: {
        cookie: 'somecookie',
      },
    } as any;

    forwardCookies(headers, req);

    expect(headers.cookie).toBe('somecookie');
  });

  it('should not forward cookies when they are not present', () => {
    const headers: Record<string, string> = {};
    const req: IncomingMessage = {
      headers: {},
    } as any;

    forwardCookies(headers, req);

    expect(headers.cookie).not.toBeDefined();
  });
});
