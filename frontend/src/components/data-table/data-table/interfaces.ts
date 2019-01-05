import { StyledDataTableProps } from '../styled-data-table';

export interface DataFetchingParams {
  /**
   * Current table filters
   */
  filtered: NonNullable<StyledDataTableProps['filtered']>;
  pageSize: number;

  /**
   * Current page number
   */
  page: number;
}

export type FetchDataCallback = (params: DataFetchingParams) => any;
export type ForceFetchData = () => any;
