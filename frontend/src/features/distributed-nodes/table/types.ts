import { List } from 'immutable';
import { Entity } from 'models';
import { Omit } from 'ramda';

export interface DistributedNodeModel extends Entity {
  'trust-level': number;
  'last-keep-alive-time': number;
}

export interface DistributedNodesTableProps {
  data: DistributedNodeModel[];
  totalRecordsCount: number;
}

export interface DistributedNodesTableState
  extends Omit<DistributedNodesTableProps, 'data'> {
  data: List<DistributedNodeModel>;
  loading: boolean;
  filteringEnabled: boolean;
}
