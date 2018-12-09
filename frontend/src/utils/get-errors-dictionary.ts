import { JsonApiErrorResponse } from 'kitsu';
import { Dictionary } from 'lodash';

export function getErrorsDictionary(response: JsonApiErrorResponse<any>) {
  const errorsDictionary: Dictionary<string> = {};

  for (const [, value] of Object.entries(response.errors)) {
    if (value.title) {
      errorsDictionary[value.title] = value.detail ? value.detail : '';
    }
  }

  return errorsDictionary;
}
