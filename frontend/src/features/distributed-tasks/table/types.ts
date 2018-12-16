import { List } from 'immutable';
import Kitsu from 'kitsu';
import { Omit } from 'lodash';

import { DistributedTask, DistributedTaskDefinition } from 'models';

import { ForceFetchData } from 'components/data-table/data-table';
import { WithSelectableRowsAdditionalProps } from 'components/data-table/with-selectable-rows';

export interface DistributedTaskWithDefinition extends DistributedTask {
  'distributed-task-definition': DistributedTaskDefinition;
}

export interface DistributedTasksTableOwnProps {
  data: DistributedTaskWithDefinition[];
  totalRecordsCount: number;

  /**
   * If set, the table will only display distributed tasks for a given distributed task definition.
   */
  bindDistributedTaskDefinitionId?: number;
}

export interface DistributedTasksTableDependencies {
  kitsu: Kitsu;
}

export type DistributedTasksTableProps = DistributedTasksTableOwnProps &
  DistributedTasksTableDependencies;

export interface DistributedTasksTableState
  extends Omit<
      DistributedTasksTableOwnProps,
      'data' | 'bindDistributedTaskDefinitionId'
    > {
  data: List<DistributedTaskWithDefinition>;
  loading: boolean;
  selectedRowIds: WithSelectableRowsAdditionalProps['selectedRowIds'];
  filteringEnabled: boolean;
  forceFetchDataCallback: ForceFetchData;
}
