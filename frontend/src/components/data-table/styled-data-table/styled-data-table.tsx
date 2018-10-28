import { List } from 'immutable';
import React, { PureComponent, ReactNode } from 'react';
import ReactTable, { TableProps } from 'react-table';

import { Omit } from 'types/omit';

import { PaginationButton } from './pagination-button';
import { TableWithSummary, TableWithSummaryProps } from './table-with-summary';

export interface StyledDataTableProps extends Omit<TableProps, 'data'> {
  data: List<any>;
  resolveData(data: List<any>): any[];

  renderSummary?(): ReactNode;
}

export class StyledDataTable extends PureComponent<StyledDataTableProps> {
  public static defaultProps: Partial<StyledDataTableProps> = {
    NextComponent: PaginationButton,
    PreviousComponent: PaginationButton,
    TableComponent: TableWithSummary,
    getTableProps: () => ({}),
    renderSummary: () => null,
  };

  public render() {
    const { data, ...rest } = this.props;

    return (
      <ReactTable
        {...rest}
        data={data as any}
        getTableProps={this.getTableProps}
      />
    );
  }

  private getTableProps: TableProps['getTableProps'] = (
    ...args
  ): TableWithSummaryProps => ({
    ...(this.props.getTableProps as NonNullable<TableProps['getTableProps']>)(
      ...args,
    ),
    renderSummary: this.props.renderSummary as () => ReactNode,
  });
}
