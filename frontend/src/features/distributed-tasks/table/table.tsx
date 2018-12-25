import { Button, Heading, minorScale, Pane, Text, toaster } from 'evergreen-ui';
import { List, Set } from 'immutable';
import { compose, filter, isNil, not } from 'ramda';
import React, { Component } from 'react';
import { Column } from 'react-table';
import selectTableHOC from 'react-table/lib/hoc/selectTable';

import { LongTextCell, TextCell } from 'components/data-table/cells';
import { DataTable, DataTableProps } from 'components/data-table/data-table';
import {
  DataTableView,
  DataTableViewProps,
} from 'components/data-table/data-table-view';
import {
  CreateActionButton,
  DeleteActionButton,
  RefreshActionButton,
  ToggleFiltersActionButton,
} from 'components/data-table/data-table-view/action-buttons';
import { NumberFilter, TextFilter } from 'components/data-table/filters';
import { TableWithSummaryProps } from 'components/data-table/styled-data-table/table-with-summary';
import {
  withSelectableRows,
  WithSelectableRowsAdditionalProps,
} from 'components/data-table/with-selectable-rows';
import {
  DependenciesExtractor,
  withDependencies,
} from 'components/dependency-injection/with-dependencies';
import { Link } from 'components/link';

import { BaseDependencies } from 'product-specific';

import { getEntities } from 'utils/table/get-entities';
import { preventPropagationHandler } from 'utils/table/prevent-propagation-handler';

import { distributedTaskModelName } from './common';
import { DistributedTaskStatusCell } from './distributed-task-status-cell';
import { DistributedTaskStatusFilter } from './status-filter';
import {
  DistributedTasksTableDependencies,
  DistributedTasksTableProps,
  DistributedTasksTableState,
  DistributedTaskWithDefinition,
} from './types';

const SelectDataTable = selectTableHOC(DataTable);
const Table = withSelectableRows(SelectDataTable);

const isNotNil = compose(
  not,
  isNil,
);

export class PureDistributedTasksTable extends Component<
  DistributedTasksTableProps,
  DistributedTasksTableState
> {
  private filterableColumnIds = ['name', 'priority', 'status'];
  private columns = filter(isNotNil, [
    {
      id: 'name',
      accessor: 'name',
      Header: <Text>Name</Text>,
      Cell: LongTextCell,
      Filter: TextFilter,
      minWidth: 150,
    },

    this.props.bindDistributedTaskDefinitionId === undefined
      ? {
          id: 'distributed-task-definition-name',
          accessor: (distributedTask) =>
            distributedTask['distributed-task-definition'].name,
          Header: <Text>Distributed Task Definition</Text>,
          Cell: LongTextCell,
          Filter: TextFilter,
          minWidth: 150,
        }
      : undefined,

    {
      id: 'priority',
      accessor: 'priority',
      Header: <Text>Priority</Text>,
      Cell: TextCell,
      Filter: NumberFilter,
      minWidth: 100,
    },
    {
      accessor: 'trust-level-to-complete',
      Header: <Text>Required trust level</Text>,
      Cell: TextCell,
      minWidth: 150,
    },
    {
      id: 'status',
      accessor: 'status',
      Header: <Text>Status</Text>,
      Cell: DistributedTaskStatusCell,
      Filter: DistributedTaskStatusFilter,
      minWidth: 100,
    },
    {
      id: 'action',
      Header: <Text>Action</Text>,
      Cell: (cellProps) => (
        <Pane onClick={preventPropagationHandler}>
          <Button
            marginRight={minorScale(2)}
            iconBefore="trash"
            intent="danger"
            onClick={this.onDeleteButtonClick(cellProps.original.id)}
          >
            Delete
          </Button>

          <Link route={`/distributed-tasks/${cellProps.original.id}/update`}>
            <Button iconBefore="edit" marginRight={minorScale(2)}>
              Edit
            </Button>
          </Link>

          <Link route={`/distributed-tasks/${cellProps.original.id}`}>
            <Button iconBefore="chevron-right">See details</Button>
          </Link>
        </Pane>
      ),
      minWidth: 290,
    },
  ] as Array<Column<DistributedTaskWithDefinition> | boolean>) as Array<
    Column<DistributedTaskWithDefinition>
  >;

  constructor(props: DistributedTasksTableProps) {
    super(props);

    const { data } = props;

    this.state = {
      ...props,
      data: List(data),
      loading: false,
      selectedRowIds: Set(),
      filteringEnabled: false,
      forceFetchDataCallback: () => null,
    };
  }

  public render() {
    const {
      data,
      totalRecordsCount,
      loading,
      selectedRowIds,
      filteringEnabled,
    } = this.state;

    return (
      <DataTableView
        header={<Heading size={600}>Distributed Tasks</Heading>}
        renderActionButtons={this.renderActionButtons}
      >
        <Table
          data={data}
          columns={this.columns}
          filterableColumnIds={this.filterableColumnIds}
          filteringEnabled={filteringEnabled}
          loading={loading}
          selectedRowIds={selectedRowIds}
          onSelectionChange={this.onSelectionChange}
          renderSummary={this.renderSummary}
          totalRecordsCount={totalRecordsCount}
          onFetchData={this.fetchData}
          initialPage={1}
          initialPageSize={10}
          getForceFetchData={this.getFetchDataCallback}
        />
      </DataTableView>
    );
  }

  private renderSummary: TableWithSummaryProps['renderSummary'] = () => (
    <Text size={600} marginY={minorScale(2)}>
      Selected {this.state.selectedRowIds.size} out of{' '}
      {this.state.totalRecordsCount} elements.
    </Text>
  );

  private fetchData: DataTableProps['onFetchData'] = async ({
    filtered,
    pageSize,
    page,
  }) => {
    const { filteringEnabled } = this.state;
    const { kitsu } = this.props;
    this.setState({ loading: true });

    if (!filteringEnabled) {
      filtered = [];
    }

    const { data, totalRecordsCount } = await getEntities<
      DistributedTaskWithDefinition
    >(
      kitsu,
      distributedTaskModelName,
      filtered,
      page,
      pageSize,
      'distributed-task-definition',
    );

    this.setState({
      data: List(data),
      totalRecordsCount,
      loading: false,
    });
  };

  private onDeleteButtonClick = (id: string) => () => {
    this.setState({
      loading: true,
    });

    this.deleteDistributedTask(id)
      .then(() => {
        toaster.success('The entity has been deleted');
        this.state.forceFetchDataCallback();
      })
      .catch(() => {
        toaster.danger('An error occurred while trying to delete the entity');

        this.setState({
          loading: false,
        });
      });
  };

  private renderActionButtons: DataTableViewProps['renderActionButtons'] = () => (
    <>
      {this.props.bindDistributedTaskDefinitionId && (
        <Link
          route={`/distributed-tasks/create/${
            this.props.bindDistributedTaskDefinitionId
          }`}
        >
          <CreateActionButton />
        </Link>
      )}
      <RefreshActionButton
        onClick={this.state.forceFetchDataCallback}
        disabled={this.state.loading}
      />
      <DeleteActionButton
        onClick={this.onBulkDeleteActionClick}
        disabled={this.state.selectedRowIds.size === 0 || this.state.loading}
      />
      <ToggleFiltersActionButton
        filtersEnabled={this.state.filteringEnabled}
        onClick={this.toggleFilters}
      />
    </>
  );

  private onBulkDeleteActionClick = async () => {
    this.setState({
      loading: true,
    });

    try {
      await Promise.all(
        this.state.selectedRowIds.map(this.deleteDistributedTask),
      );

      this.setState({
        selectedRowIds: Set(),
      });
      toaster.success('The entities have been deleted');
    } catch (error) {
      toaster.danger('An error occurred while deleting the entites');
    }

    this.state.forceFetchDataCallback();
  };

  private deleteDistributedTask = (id: string) =>
    this.props.kitsu.delete(distributedTaskModelName, id);

  private toggleFilters = () => {
    this.setState(
      ({ filteringEnabled }) => ({
        filteringEnabled: !filteringEnabled,
      }),
      this.state.forceFetchDataCallback,
    );
  };

  private onSelectionChange: WithSelectableRowsAdditionalProps['onSelectionChange'] = (
    selectedRowIds,
  ) => this.setState({ selectedRowIds });

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
  DistributedTasksTableDependencies
> = ({ kitsu }) => ({ kitsu });

export const DistributedTasksTable = withDependencies(dependenciesExtractor)(
  PureDistributedTasksTable,
);
