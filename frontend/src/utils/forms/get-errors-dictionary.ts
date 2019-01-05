import { JsonApiErrorResponse } from 'kitsu';
import { Dictionary } from 'lodash';

/**
 * Returns a dictionary of errors from a given JSON API error response.
 * @param response
 */
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
