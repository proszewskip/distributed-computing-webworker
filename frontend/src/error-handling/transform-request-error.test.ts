import { JsonApiErrorResponse } from 'kitsu';
import { transformRequestError } from './transform-request-error';
import { JsonApiErrors, NativeError } from './types';

describe('transformRequestError', () => {
  it('should transform json api errors', () => {
    const error: JsonApiErrorResponse = {
      errors: [{ status: '403' }],
    };

    const transformedError = transformRequestError(error);

    expect(transformedError.type).toBe('jsonApiErrors');
    expect((transformedError as JsonApiErrors).errors).toBe(error.errors);
  });

  it('should native errors', () => {
    const error = new Error('some message');

    const transformedError = transformRequestError(error);

    expect(transformedError.type).toBe('nativeError');
    expect((transformedError as NativeError).name).toBe('Error');
    expect((transformedError as NativeError).message).toBe('some message');
  });

  it('should transform string errors', () => {
    const error = 'string error';

    const transformedError = transformRequestError(error);

    expect(transformedError.type).toBe('nativeError');
    expect((transformedError as NativeError).name).toBe('Unknown error');
    expect((transformedError as NativeError).message).toBe('string error');
  });

  it('should transform unexpected errors', () => {
    const error = {};

    const transformedError = transformRequestError(error);

    expect(transformedError.type).toBe('nativeError');
    expect((transformedError as NativeError).name).toBe('Unknown error');
    expect((transformedError as NativeError).message).toBeDefined();
  });
});
