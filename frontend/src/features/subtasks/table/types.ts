import { List } from 'immutable';
import Kitsu from 'kitsu';
import { Omit } from 'ramda';

import { ForceFetchData } from 'components/data-table/data-table';

import { Subtask } from 'models';

import { RequestError } from 'error-handling';

export interface SubtasksTableDependencies {
  kitsu: Kitsu;
}

export interface SubtasksTableOwnProps {
  distributedTaskId: string;
  data: Subtask[];
  totalRecordsCount: number;
  dataFetchingError?: RequestError;
}

export type SubtasksTableProps = SubtasksTableDependencies &
  SubtasksTableOwnProps;

export interface SubtasksTableState
  extends Omit<SubtasksTableOwnProps, 'data'> {
  data: List<Subtask>;
  loading: boolean;
  filteringEnabled: boolean;
  forceFetchDataCallback: ForceFetchData;
}
