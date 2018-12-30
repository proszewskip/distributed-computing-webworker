import { JsonApiError } from 'kitsu';

type BaseError<Type extends string, Payload> = { type: Type } & Payload;

export type NativeError = BaseError<
  'nativeError',
  { name: string; message: string }
>;

export type JsonApiErrors = BaseError<
  'jsonApiErrors',
  { errors: JsonApiError[] }
>;

export type RequestError = NativeError | JsonApiErrors;
