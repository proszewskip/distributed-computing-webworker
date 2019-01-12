import { KeepAliveService } from './keep-alive-service';

describe('KeepAliveService', () => {
  describe('sendKeepAlive', () => {
    it('should send a request', async () => {
      const fetch = jest.fn(() => Promise.resolve({ ok: true }));

      const keepAliveService = new KeepAliveService({ fetch });

      const result = await keepAliveService.sendKeepAlive('123');

      expect(fetch.mock.calls[0][0] as string).toMatch(
        /distributed-nodes\/123\/keep-alive/,
      );
      expect(result).toBe(true);
    });

    it('should reject when the request failed', async () => {
      const fetch = jest.fn(() => Promise.resolve({ ok: false }));

      const keepAliveService = new KeepAliveService({ fetch });

      expect.assertions(1);

      try {
        await keepAliveService.sendKeepAlive('123');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('startPolling', () => {
    let fetch: jest.Mock;
    let keepAliveService: KeepAliveService;

    beforeAll(() => {
      jest.useFakeTimers();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    beforeEach(() => {
      fetch = jest.fn(() => Promise.resolve({ ok: true }));
      keepAliveService = new KeepAliveService({ fetch });
    });

    afterEach(() => {
      if (keepAliveService.isPolling) {
        keepAliveService.stopPolling();
      }
    });

    it('should send a keep-alive immediately', () => {
      keepAliveService.startPolling('123');

      expect(fetch).toHaveBeenCalled();
    });

    it('should send a keep-alive after some delay', (done) => {
      keepAliveService.startPolling('123');

      setImmediate(() => {
        jest.runOnlyPendingTimers();

        expect(fetch).toHaveBeenCalledTimes(2);

        done();
      });
    });
  });
});
