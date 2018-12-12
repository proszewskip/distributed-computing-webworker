import Kitsu, { GetParams } from 'kitsu';

import { StyledDataTableProps } from 'components/data-table/styled-data-table';
import { Dictionary } from 'ramda';

import { Entity } from 'models';

export async function getEntities<Model extends Entity>(
  kitsu: Kitsu,
  modelName: string,
  filters: StyledDataTableProps['filtered'] = [],
  page = 1,
  pageSize = 20,
) {
  const filtersDictionary: Dictionary<string> = {};

  filters.forEach(({ id, value }) => {
    filtersDictionary[id] = value;
  });

  const getParams: GetParams = {
    filter: filtersDictionary,
    page: {
      size: pageSize,
      number: page,
    },
  };

  const response = await kitsu.get<Model>(modelName, getParams);

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
