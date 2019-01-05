import {
  BackButton,
  Button,
  Card,
  majorScale,
  minorScale,
  Pane,
  Text,
  toaster,
} from 'evergreen-ui';
import React, { PureComponent, ReactNode } from 'react';

import {
  DependenciesExtractor,
  withDependencies,
} from 'components/dependency-injection/with-dependencies';

import { ErrorPage, RequestErrorInfo } from 'components/errors';
import { Link } from 'components/link';
import { withRouter } from 'components/router';

import { BaseDependencies } from 'product-specific';

import { DistributedTasksTable } from 'features/distributed-tasks';

import {
  DistributedTaskDefinitionDetailsDependencies,
  DistributedTaskDefinitionDetailsState,
  PureDistributedTaskDefinitionDetailsProps,
} from './types';

const dependenciesExtractor: DependenciesExtractor<
  BaseDependencies,
  DistributedTaskDefinitionDetailsDependencies
> = ({ kitsu }) => ({ kitsu });

export class PureDistributedTaskDefinitionDetails extends PureComponent<
  PureDistributedTaskDefinitionDetailsProps,
  DistributedTaskDefinitionDetailsState
> {
  public state = {
    deleteRequestPending: false,
  };

  public render() {
    return (
      <>
        {this.renderErrors()}
        {this.renderDetails()}
        {this.renderDistributedTasksTable()}
      </>
    );
  }

  private renderDetails = (): ReactNode => {
    const { detailsData, id } = this.props;

    if (!detailsData) {
      return null;
    }

    const { deleteRequestPending } = this.state;

    const problemPluginInfo = detailsData['problem-plugin-info'];

    return (
      <>
        <Pane marginBottom={majorScale(2)}>
          <BackButton
            onClick={this.onBackButtonClick}
            marginRight={minorScale(2)}
          />

          <Button
            marginRight={minorScale(2)}
            iconBefore="trash"
            intent="danger"
            disabled={deleteRequestPending}
            onClick={this.onDeleteButtonClick}
          >
            Delete
          </Button>

          <Link route={`/distributed-task-definitions/${id}/update`}>
            <Button iconBefore="edit">Edit</Button>
          </Link>
        </Pane>

        <Card
          background="tint2"
          display="grid"
          gridTemplateColumns="minmax(min-content, max-content) 1fr"
          gridGap={minorScale(4)}
          padding={minorScale(2)}
          maxWidth={600}
          overflow="auto"
          marginBottom={majorScale(2)}
        >
          <Pane>
            <Text>ID</Text>
          </Pane>
          <Pane>
            <Text>{detailsData.id}</Text>
          </Pane>

          <Pane>
            <Text>Name</Text>
          </Pane>
          <Pane>
            <Text>{detailsData.name}</Text>
          </Pane>

          <Pane>
            <Text>Description</Text>
          </Pane>
          <Pane>
            <Text>{detailsData.description}</Text>
          </Pane>

          <Pane>
            <Text>Main DLL name</Text>
          </Pane>
          <Pane>
            <Text>{detailsData['main-dll-name']}</Text>
          </Pane>

          <Pane>
            <Text>Class path</Text>
          </Pane>
          <Pane>
            <Text>
              {problemPluginInfo['assembly-name']}.{problemPluginInfo.namespace}
              .{problemPluginInfo['class-name']}
            </Text>
          </Pane>
        </Card>
      </>
    );
  };

  private renderDistributedTasksTable = (): ReactNode => {
    const { tableData } = this.props;
    const { id } = this.props;

    if (!tableData) {
      return null;
    }

    return (
      <DistributedTasksTable
        {...tableData}
        bindDistributedTaskDefinitionId={id}
      />
    );
  };

  private renderErrors = (): ReactNode => {
    const { dataFetchingError } = this.props;

    if (!dataFetchingError) {
      return null;
    }

    return (
      <ErrorPage>
        <RequestErrorInfo error={dataFetchingError} />

        <Link route="/distributed-task-definitions">
          <a>Go back to the list of distributed task definitions</a>
        </Link>
      </ErrorPage>
    );
  };

  private onDeleteButtonClick = () => {
    this.setState({ deleteRequestPending: true });

    this.props.kitsu
      .delete('distributed-task-definition', this.props.id)
      .then(() => {
        toaster.success('The task definition has been deleted');
        this.props.router.pushRoute('/distributed-task-definitions');
      })
      .catch(() => {
        toaster.danger('Failed to delete the task definition');
      })
      .then(() => {
        this.setState({ deleteRequestPending: false });
      });
  };

  private onBackButtonClick = () => {
    this.props.router.pushRoute('/distributed-task-definitions');
  };
}

export const DistributedTaskDefinitionDetails = withRouter(
  withDependencies(dependenciesExtractor)(PureDistributedTaskDefinitionDetails),
);
