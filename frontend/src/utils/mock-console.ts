export function mockConsole() {
  // tslint:disable:no-console
  let realConsoleError: typeof console.error;

  beforeAll(() => {
    realConsoleError = console.error;
  });

  afterAll(() => {
    console.error = realConsoleError;
  });

  beforeEach(() => {
    console.error = jest.fn();
  });
}
