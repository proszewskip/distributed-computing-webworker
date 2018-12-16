import { JsonApiSuccessResponse } from 'kitsu';

export function extractDataAndRecordsCount<Model>(
  response: JsonApiSuccessResponse<Model>,
) {
  if (!Array.isArray(response.data)) {
    throw new Error('Invalid response from the server.');
  }

  let totalRecordsCount = response.data.length;

  if (response.meta && response.meta['total-records']) {
    totalRecordsCount = response.meta['total-records'];
  }

  return {
    data: response.data,
    totalRecordsCount,
  };
}
