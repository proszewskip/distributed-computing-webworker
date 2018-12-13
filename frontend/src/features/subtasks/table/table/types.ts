import { List } from 'immutable';
import Kitsu from 'kitsu';
import { Omit } from 'ramda';

import { ForceFetchData } from 'components/data-table/data-table';

import { Subtask } from 'models';

export interface SubtasksTableDependencies {
  kitsu: Kitsu;
}

export interface SubtasksTableOwnProps {
  data: Subtask[];
  totalRecordsCount: number;
}

export type SubtasksTableProps = SubtasksTableDependencies &
  SubtasksTableOwnProps;

export interface SubtasksTableState extends Omit<SubtasksTableProps, 'data'> {
  data: List<Subtask>;
  loading: boolean;
  filteringEnabled: boolean;
  forceFetchDataCallback: ForceFetchData;
}
