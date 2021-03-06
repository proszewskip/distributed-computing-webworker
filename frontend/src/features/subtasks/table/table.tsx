import { Heading, Text } from 'evergreen-ui';
import { List } from 'immutable';
import { identity } from 'ramda';
import React, { Component } from 'react';
import { Column } from 'react-table';

import { TextCell } from 'components/data-table/cells';
import { DataTable, DataTableProps } from 'components/data-table/data-table';
import {
  DataTableView,
  DataTableViewProps,
} from 'components/data-table/data-table-view';
import {
  RefreshActionButton,
  ToggleFiltersActionButton,
} from 'components/data-table/data-table-view/action-buttons';
import { DataTableError } from 'components/data-table/errors';

import {
  DependenciesExtractor,
  withDependencies,
} from 'components/dependency-injection/with-dependencies';

import { Subtask } from 'models';

import { BaseDependencies } from 'product-specific';

import { transformRequestError } from 'error-handling';

import { getEntities } from 'utils/table/get-entities';

import { SubtaskStatusCell } from './subtask-status-cell';
import { SubtaskStatusFilter } from './subtask-status-filter';
import {
  SubtasksTableDependencies,
  SubtasksTableProps,
  SubtasksTableState,
} from './types';

export class PureSubtasksTable extends Component<
  SubtasksTableProps,
  SubtasksTableState
> {
  private filterableColumnIds = ['subtask-status'];
  private columns: Column[] = [
    {
      accessor: 'sequence-number',
      Header: <Text>Sequence number</Text>,
      Cell: TextCell,
      minWidth: 100,
    },
    {
      id: 'subtask-status',
      accessor: identity,
      Header: <Text>Status</Text>,
      Filter: SubtaskStatusFilter,
      Cell: SubtaskStatusCell,
      minWidth: 200,
    },
  ];

  constructor(props: SubtasksTableProps) {
    super(props);

    const { data } = props;

    this.state = {
      ...props,
      data: List(data),
      loading: false,
      filteringEnabled: false,
      forceFetchDataCallback: () => null,
    };
  }

  public render() {
    const {
      data,
      totalRecordsCount,
      loading,
      filteringEnabled,
      dataFetchingError,
    } = this.state;

    return (
      <DataTableView
        header={<Heading size={600}>Distributed subtasks</Heading>}
        renderActionButtons={this.renderActionButtons}
      >
        {dataFetchingError && <DataTableError error={dataFetchingError} />}
        <DataTable
          data={data}
          columns={this.columns}
          filterableColumnIds={this.filterableColumnIds}
          filteringEnabled={filteringEnabled}
          loading={loading}
          totalRecordsCount={totalRecordsCount}
          onFetchData={this.fetchData}
          initialPage={1}
          initialPageSize={10}
          getForceFetchData={this.getFetchDataCallback}
        />
      </DataTableView>
    );
  }

  private fetchData: DataTableProps['onFetchData'] = ({
    filtered,
    pageSize,
    page,
  }) => {
    this.setState({ loading: true, dataFetchingError: undefined });

    const { kitsu, distributedTaskId } = this.props;

    if (!this.state.filteringEnabled) {
      filtered = [];
    }

    if (!filtered.find((filter) => filter.id === 'distributed-task-id')) {
      filtered.push({ id: 'distributed-task-id', value: distributedTaskId });
    }

    return getEntities<Subtask>(
      kitsu,
      'subtask',
      filtered,
      page,
      pageSize,
      undefined,
      'sequence-number',
    )
      .then(({ data, totalRecordsCount }) => {
        this.setState({
          data: List(data),
          totalRecordsCount,
        });
      })
      .catch((error) => {
        this.setState({
          dataFetchingError: transformRequestError(error),
        });
      })
      .then(() => {
        this.setState({
          loading: false,
        });
      });
  };

  private renderActionButtons: DataTableViewProps['renderActionButtons'] = () => (
    <>
      <RefreshActionButton
        onClick={this.state.forceFetchDataCallback}
        disabled={this.state.loading}
      />
      <ToggleFiltersActionButton
        filtersEnabled={this.state.filteringEnabled}
        onClick={this.toggleFilters}
      />
    </>
  );

  private toggleFilters = () => {
    this.setState(
      ({ filteringEnabled }) => ({
        filteringEnabled: !filteringEnabled,
      }),
      this.state.forceFetchDataCallback,
    );
  };

  private getFetchDataCallback: DataTableProps['getForceFetchData'] = (
    fetchData,
  ) => {
    this.setState({
      forceFetchDataCallback: fetchData,
    });
  };
}

const dependenciesExtractor: DependenciesExtractor<
  BaseDependencies,
  SubtasksTableDependencies
> = ({ kitsu }) => ({ kitsu });

export const SubtasksTable = withDependencies(dependenciesExtractor)(
  PureSubtasksTable,
);
