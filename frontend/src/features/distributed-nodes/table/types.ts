import { List } from 'immutable';
import Kitsu from 'kitsu';
import { Omit } from 'ramda';

import { ForceFetchData } from 'components/data-table/data-table';

import { DistributedNode } from 'models';

export interface DistributedNodesTableProps {
  data: DistributedNode[];
  totalRecordsCount: number;
  kitsu: Kitsu;
}

export interface DistributedNodesTableState
  extends Omit<DistributedNodesTableProps, 'data'> {
  data: List<DistributedNode>;
  loading: boolean;
  filteringEnabled: boolean;
  forceFetchDataCallback: ForceFetchData;
}
