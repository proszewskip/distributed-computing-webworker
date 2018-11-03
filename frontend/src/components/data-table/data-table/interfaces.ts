import { StyledDataTableProps } from '../styled-data-table';

export interface DataFetchingParams {
  filtered: NonNullable<StyledDataTableProps['filtered']>;
  pageSize: number;
  page: number;
}

export type FetchDataCallback = (params: DataFetchingParams) => any;
export type ForceFetchData = () => any;
