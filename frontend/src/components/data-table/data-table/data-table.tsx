import debounce from 'lodash.debounce';
import React, { PureComponent } from 'react';
import {
  FilteredChangeFunction,
  PageChangeFunction,
  PageSizeChangeFunction,
} from 'react-table';

import { Omit } from 'types/omit';

import { StyledDataTable, StyledDataTableProps } from '../styled-data-table';
import { withFiltering } from '../with-filtering';
import {
  DataFetchingParams,
  FetchDataCallback,
  ForceFetchData,
} from './interfaces';

type StyledDataTableLeftProps = Omit<
  StyledDataTableProps,
  'page' | 'pages' | 'pageSize'
>;

interface DataTableProps extends StyledDataTableLeftProps {
  initialFiltered?: StyledDataTableProps['filtered'];
  initialPage: number;
  initialPageSize: number;
  totalRecordsCount: number;
  onFetchData?: FetchDataCallback;
  getForceFetchData?(forceFetchData: ForceFetchData): any;
}

type DataTableState = DataFetchingParams;

class DataTable extends PureComponent<DataTableProps, DataTableState> {
  private debouncedFetchData: () => any;

  constructor(props: DataTableProps) {
    super(props);

    this.state = {
      filtered: props.initialFiltered || [],
      page: props.initialPage,
      pageSize: props.initialPageSize,
    };

    this.debouncedFetchData = debounce(this.fetchData, 250);
  }

  public componentDidMount() {
    const { getForceFetchData } = this.props;

    if (getForceFetchData) {
      getForceFetchData(this.fetchData);
    }
  }

  public componentDidUpdate(prevProps: DataTableProps) {
    const { getForceFetchData } = this.props;
    if (
      getForceFetchData &&
      getForceFetchData !== prevProps.getForceFetchData
    ) {
      getForceFetchData(this.fetchData);
    }
  }

  public render() {
    const { filtered, page, pageSize } = this.state;
    const pagesCount = Math.ceil(this.props.totalRecordsCount / pageSize);

    return (
      <StyledDataTable
        {...this.props}
        onFetchData={this.noop}
        pages={pagesCount}
        page={page - 1}
        onPageChange={this.onPageChange}
        pageSize={pageSize}
        onPageSizeChange={this.onPageSizeChange}
        filtered={filtered}
        onFilteredChange={this.onFilteredChange}
        manual={true}
        sortable={false}
      />
    );
  }

  private noop = () => null;

  private fetchData = () => {
    const { onFetchData } = this.props;
    const { filtered, pageSize, page } = this.state;

    if (!onFetchData) {
      return;
    }

    onFetchData({ filtered, page, pageSize });
  };

  private onPageChange: PageChangeFunction = (page) => {
    this.setState(
      {
        page: page + 1,
      },
      () => this.notifyOnPageChange(),
    );
  };

  private notifyOnPageChange = () => {
    const { onPageChange } = this.props;

    if (onPageChange) {
      onPageChange(this.state.page);
    }
    this.fetchData();
  };

  private onPageSizeChange: PageSizeChangeFunction = (pageSize, page) => {
    this.setState(
      {
        page: page + 1,
        pageSize,
      },
      () => this.notifyOnPageSizeChange(),
    );
  };

  private notifyOnPageSizeChange = () => {
    const { onPageSizeChange } = this.props;
    const { page, pageSize } = this.state;

    if (onPageSizeChange) {
      onPageSizeChange(pageSize, page);
    }

    this.fetchData();
  };

  private onFilteredChange: FilteredChangeFunction = (filtered, ...args) => {
    this.setState({ filtered }, () =>
      this.notifyOnFilteredChange(filtered, ...args),
    );
  };

  private notifyOnFilteredChange: FilteredChangeFunction = (...args) => {
    if (this.props.onFilteredChange) {
      this.props.onFilteredChange(...args);
    }

    this.debouncedFetchData();
  };
}

const EnhancedDataTable = withFiltering(DataTable);

export { EnhancedDataTable as DataTable };
