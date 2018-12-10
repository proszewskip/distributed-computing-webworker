import { JsonApiError } from 'kitsu';

export type RequestError = Error | JsonApiError[];
