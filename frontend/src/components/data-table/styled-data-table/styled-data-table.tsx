import { List } from 'immutable';
import React, { PureComponent, ReactNode } from 'react';
import ReactTable, { TableProps } from 'react-table';

import 'react-table/react-table.css';
import './overrides.css';

import { Omit } from 'types/omit';

import { PaginationButton } from './pagination-button';
import { TableWithSummary, TableWithSummaryProps } from './table-with-summary';

export interface StyledDataTableProps
  extends Omit<Partial<TableProps>, 'data' | 'resolveData'> {
  children?: TableProps['children'];

  data: List<any>;
  resolveData?(data: List<any>): any[];

  renderSummary?(): ReactNode;
}

/**
 * A base data table with custom styles applied.
 *
 * Handles ImmutableJS data.
 *
 * Allows for a summary in the footer.
 */
export class StyledDataTable extends PureComponent<StyledDataTableProps> {
  public static defaultProps: Partial<StyledDataTableProps> = {
    NextComponent: PaginationButton,
    PreviousComponent: PaginationButton,
    TableComponent: TableWithSummary,
    getTableProps: () => ({}),
    renderSummary: () => null,
    resolveData: (data) => data.toJS(),
  };

  public render() {
    const { data, resolveData, ...rest } = this.props;

    /**
     * NOTE: `as any` type assertion are required becuase typings for react-table only allow
     * arrays as data, not Immutable lists.
     */
    return (
      <ReactTable
        {...rest}
        data={data as any}
        resolveData={resolveData as any}
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
