import { GetParams } from 'kitsu';

import { kitsuFactory } from 'product-specific';

import { StyledDataTableProps } from 'components/data-table/styled-data-table';
import { Dictionary } from 'ramda';

const kitsu = kitsuFactory();

export async function getEntities<T extends { id: string }>(
  modelName: string,
  filters: NonNullable<StyledDataTableProps['filtered']> = [],
  page = 1,
  pageSize = 20,
) {
  const filtersDictionary: Dictionary<string> = {};

  filters.forEach(({ id, value }: any) => {
    filtersDictionary[id] = value;
  });

  const getParams: GetParams = {
    filter: filtersDictionary,
    page: {
      size: pageSize,
      number: page,
    },
  };

  const kitsuResponse = await kitsu.get<T>(modelName, getParams);

  if (!kitsuResponse.data || !Array.isArray(kitsuResponse.data)) {
    throw new Error('Invalid response from the server.');
  }

  let totalRecordsCount = kitsuResponse.data.length;

  if (kitsuResponse.meta && kitsuResponse.meta['total-records']) {
    totalRecordsCount = kitsuResponse.meta['total-records'];
  }

  return {
    data: kitsuResponse.data,
    totalRecordsCount,
  };
}
