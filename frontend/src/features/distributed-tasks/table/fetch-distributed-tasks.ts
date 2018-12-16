import Kitsu, { GetParams } from 'kitsu';

import {
  DistributedTasksTableOwnProps,
  DistributedTaskWithDefinition,
} from './types';

import { extractDataAndRecordsCount } from 'utils/table/extract-data-and-records-count';

export const fetchDistributedTasks = (
  kitsu: Kitsu,
  distributedTaskDefinitionId?: number,
): Promise<DistributedTasksTableOwnProps> => {
  const getParams = prepareGetParams(distributedTaskDefinitionId);

  return kitsu
    .get<DistributedTaskWithDefinition>('distributed-task', getParams)
    .then(
      (response): DistributedTasksTableOwnProps => ({
        bindDistributedTaskDefinitionId: distributedTaskDefinitionId,
        ...extractDataAndRecordsCount(response),
      }),
    );
};

function prepareGetParams(distributedTaskDefinitionId?: number) {
  const getParams: GetParams = {};

  if (distributedTaskDefinitionId !== undefined) {
    getParams.include = 'distributed-task-definition';
  }

  return getParams;
}
