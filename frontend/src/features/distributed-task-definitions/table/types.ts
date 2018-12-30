import { List } from 'immutable';
import Kitsu from 'kitsu';
import { Omit } from 'lodash';

import { DistributedTaskDefinition } from 'models';

import { ForceFetchData } from 'components/data-table/data-table';
import { WithSelectableRowsAdditionalProps } from 'components/data-table/with-selectable-rows';

import { RequestError } from 'error-handling';

export interface DistributedTaskDefinitionsTableOwnProps {
  data: DistributedTaskDefinition[];
  totalRecordsCount: number;
  dataFetchingError?: RequestError;
}

export interface DistributedTaskDefinitionsTableDependencies {
  kitsu: Kitsu;
}

export type DistributedTaskDefinitionsTableProps = DistributedTaskDefinitionsTableOwnProps &
  DistributedTaskDefinitionsTableDependencies;

export interface DistributedTaskDefinitionsTableState
  extends Omit<DistributedTaskDefinitionsTableOwnProps, 'data'> {
  data: List<DistributedTaskDefinition>;
  loading: boolean;
  selectedRowIds: WithSelectableRowsAdditionalProps['selectedRowIds'];
  filteringEnabled: boolean;
  forceFetchDataCallback: ForceFetchData;
}
