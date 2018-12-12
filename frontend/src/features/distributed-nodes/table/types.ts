import { List } from 'immutable';
import Kitsu from 'kitsu';
import { Omit } from 'ramda';

import { ForceFetchData } from 'components/data-table/data-table';

import { DistributedNodeModel } from 'models';

export interface DistributedNodesTableProps {
  data: DistributedNodeModel[];
  totalRecordsCount: number;
  kitsu: Kitsu;
}

export interface DistributedNodesTableState
  extends Omit<DistributedNodesTableProps, 'data'> {
  data: List<DistributedNodeModel>;
  loading: boolean;
  filteringEnabled: boolean;
  forceFetchDataCallback: ForceFetchData;
}
