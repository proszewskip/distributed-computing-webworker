import { List } from 'immutable';
import Kitsu from 'kitsu';
import { Omit } from 'ramda';

import { ForceFetchData } from 'components/data-table/data-table';

import { RequestError } from 'error-handling';

import { DistributedNode } from 'models';

export interface DistributedNodesTableDependencies {
  kitsu: Kitsu;
}

export interface DistributedNodesTableOwnProps {
  data: DistributedNode[];
  totalRecordsCount: number;
  dataFetchingError?: RequestError;
}

export type DistributedNodesTableProps = DistributedNodesTableDependencies &
  DistributedNodesTableOwnProps;

export interface DistributedNodesTableState
  extends Omit<DistributedNodesTableOwnProps, 'data'> {
  data: List<DistributedNode>;
  loading: boolean;
  filteringEnabled: boolean;
  forceFetchDataCallback: ForceFetchData;
}
