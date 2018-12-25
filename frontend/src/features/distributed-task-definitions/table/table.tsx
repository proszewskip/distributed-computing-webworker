import { Button, Heading, minorScale, Pane, Text, toaster } from 'evergreen-ui';
import { List, Set } from 'immutable';
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
import { DataTableError } from 'components/data-table/errors';
import { TextFilter } from 'components/data-table/filters';
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

import { transformRequestError } from 'error-handling';
import { DistributedTaskDefinition } from 'models';
import { BaseDependencies } from 'product-specific';

import { getEntities } from 'utils/table/get-entities';
import { preventPropagationHandler } from 'utils/table/prevent-propagation-handler';

import { distributedTaskDefinitionModelName } from './common';
import {
  DistributedTaskDefinitionsTableDependencies,
  DistributedTaskDefinitionsTableProps,
  DistributedTaskDefinitionsTableState,
} from './types';

const SelectDataTable = selectTableHOC(DataTable);
const Table = withSelectableRows(SelectDataTable);

export class PureDistributedTaskDefinitionsTable extends Component<
  DistributedTaskDefinitionsTableProps,
  DistributedTaskDefinitionsTableState
> {
  private filterableColumnIds = ['name'];
  private columns: Column[] = [
    {
      id: 'name',
      accessor: 'name',
      Header: <Text>Name</Text>,
      Cell: LongTextCell,
      Filter: TextFilter,
      minWidth: 150,
    },
    {
      accessor: 'main-dll-name',
      Header: <Text>Main DLL name</Text>,
      Cell: TextCell,
      minWidth: 150,
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

          <Link
            route={`/distributed-task-definitions/${
              cellProps.original.id
            }/update`}
          >
            <Button iconBefore="edit" marginRight={minorScale(2)}>
              Edit
            </Button>
          </Link>

          <Link
            route={`/distributed-task-definitions/${cellProps.original.id}`}
          >
            <Button iconBefore="chevron-right">See details</Button>
          </Link>
        </Pane>
      ),
      minWidth: 290,
    },
  ];

  constructor(props: DistributedTaskDefinitionsTableProps) {
    super(props);

    const { data } = props;

    this.state = {
      ...props,
      data: List(data),
      loading: false,
      selectedRowIds: Set(),
      filteringEnabled: false,
      forceFetchDataCallback: () => null,
      dataFetchingError: props.dataFetchingError,
    };
  }

  public render() {
    const {
      data,
      totalRecordsCount,
      loading,
      selectedRowIds,
      filteringEnabled,
      dataFetchingError,
    } = this.state;

    return (
      <DataTableView
        header={<Heading size={600}>Distributed Task Definitions</Heading>}
        renderActionButtons={this.renderActionButtons}
      >
        {dataFetchingError && <DataTableError error={dataFetchingError} />}
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

  private fetchData: DataTableProps['onFetchData'] = ({
    filtered,
    pageSize,
    page,
  }) => {
    const { filteringEnabled } = this.state;
    const { kitsu } = this.props;
    this.setState({ loading: true, dataFetchingError: undefined });

    if (!filteringEnabled) {
      filtered = [];
    }

    return getEntities<DistributedTaskDefinition>(
      kitsu,
      distributedTaskDefinitionModelName,
      filtered,
      page,
      pageSize,
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
          data: List(),
        });
      })
      .then(() => {
        this.setState({
          loading: false,
        });
      });
  };

  private onDeleteButtonClick = (id: string) => () => {
    this.setState({
      loading: true,
    });

    this.deleteDistributedTaskDefinition(id)
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
      <Link route="/distributed-task-definitions/create">
        <CreateActionButton />
      </Link>
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
        this.state.selectedRowIds.map(this.deleteDistributedTaskDefinition),
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

  private deleteDistributedTaskDefinition = (id: string) =>
    this.props.kitsu.delete(distributedTaskDefinitionModelName, id);

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
  DistributedTaskDefinitionsTableDependencies
> = ({ kitsu }) => ({ kitsu });

export const DistributedTaskDefinitionsTable = withDependencies(
  dependenciesExtractor,
)(PureDistributedTaskDefinitionsTable);
