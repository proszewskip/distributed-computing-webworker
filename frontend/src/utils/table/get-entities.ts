import Kitsu, { GetParams } from 'kitsu';
import { Dictionary } from 'ramda';

import { StyledDataTableProps } from 'components/data-table/styled-data-table';

import { Entity } from 'models';

import { extractDataAndRecordsCount } from './extract-data-and-records-count';

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

  return extractDataAndRecordsCount(response);
}
