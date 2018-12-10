import { JsonApiErrorResponse } from 'kitsu';
import { Dictionary } from 'lodash';

export function getErrorsDictionary(response: JsonApiErrorResponse) {
  const errorsDictionary: Dictionary<string> = {};

  if (!response.errors) {
    errorsDictionary['Undefined error'] = '';
  } else {
    Object.values(response.errors).forEach((value) => {
      if (value.title) {
        errorsDictionary[value.title] = value.detail || '';
      }
    });
  }

  return errorsDictionary;
}
