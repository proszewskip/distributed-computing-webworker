import { ComponentType, PureComponent } from 'react';
import {
  PageChangeFunction,
  PageSizeChangeFunction,
  TableProps,
} from 'react-table';

import { Omit } from 'types/omit';
import { getDisplayName } from 'utils/get-display-name';

export interface WithPaginationStorageAdditionalProps {
  initialPage?: number;
  initialPageSize?: number;
}

interface WithPaginationStorageState {
  pageSize: number;
  page: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

export function withPaginationStorage<Props extends Partial<TableProps>>(
  WrappedComponent: ComponentType<Props>,
) {
  type WithPaginationStorageOptionalProps = Pick<
    Props,
    'onPageChange' | 'onPageSizeChange' | 'children'
  >;
  type WithPaginationStorageProps = Omit<Props, 'page' | 'pageSize'> &
    WithPaginationStorageAdditionalProps &
    WithPaginationStorageOptionalProps;

  class WithPaginationStorage extends PureComponent<
    WithPaginationStorageProps,
    WithPaginationStorageState
  > {
    public static displayName = `withPaginationStorage(${getDisplayName(
      WrappedComponent,
    )})`;

    constructor(props: WithPaginationStorageProps) {
      super(props);

      this.state = {
        page: props.initialPage || DEFAULT_PAGE,
        pageSize: props.initialPageSize || DEFAULT_PAGE_SIZE,
      };
    }

    public render() {
      const { page, pageSize } = this.state;

      return (
        <WrappedComponent
          {...this.props}
          page={page}
          onPageChange={this.onPageChange}
          pageSize={pageSize}
          onPageSizeChange={this.onPageSizeChange}
        />
      );
    }

    private onPageChange: PageChangeFunction = (page) => {
      this.setState(
        {
          page: page + 1,
        },
        () => this.notifyOnPageChange(page),
      );
    };

    private notifyOnPageChange: PageChangeFunction = (page) => {
      const { onPageChange } = this.props;

      if (onPageChange) {
        onPageChange(page);
      }
    };

    private onPageSizeChange: PageSizeChangeFunction = (pageSize, page) => {
      this.setState(
        {
          page: page + 1,
          pageSize,
        },
        () => this.notifyOnPageSizeChange(pageSize, page),
      );
    };

    private notifyOnPageSizeChange: PageSizeChangeFunction = (
      pageSize,
      page,
    ) => {
      const { onPageSizeChange } = this.props;

      if (onPageSizeChange) {
        onPageSizeChange(pageSize, page);
      }
    };
  }

  return WithPaginationStorage;
}
