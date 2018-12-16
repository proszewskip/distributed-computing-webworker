import {
  BackButton,
  Button,
  Heading,
  majorScale,
  minorScale,
  Pane,
  toaster,
} from 'evergreen-ui';
import { withRouter } from 'next/router';
import React, { PureComponent, ReactNode } from 'react';

import {
  DependenciesExtractor,
  withDependencies,
} from 'components/dependency-injection/with-dependencies';

import { ErrorPage, RequestErrorInfo } from 'components/errors';

import { Link } from 'components/link';

import { DistributedTaskStatus } from 'models';
import { BaseDependencies, config } from 'product-specific';

import { DetailsGrid } from './get-details-grid';
import {
  DistributedTaskDetailsDependencies,
  DistributedTaskDetailsProps,
  DistributedTaskDetailsState,
  PureDistributedTaskDetailsProps,
} from './types';

import { SubtasksTable } from 'features/subtasks/table/table';

const dependenciesExtractor: DependenciesExtractor<
  BaseDependencies,
  DistributedTaskDetailsDependencies
> = ({ kitsu }) => ({ kitsu });

export class PureDistributedTaskDetails extends PureComponent<
  PureDistributedTaskDetailsProps,
  DistributedTaskDetailsState
> {
  public state = {
    deleteRequestPending: false,
  };

  public render() {
    return (
      <>
        {this.renderErrors()}
        {this.renderDetails()}
      </>
    );
  }

  private renderDetails = (): ReactNode => {
    const { detailsData, tableData } = this.props;

    if (!detailsData || !tableData) {
      return null;
    }

    const { data, totalRecordsCount } = tableData;

    return (
      <>
        {this.renderActionButtons()}

        <DetailsGrid details={detailsData} />

        <Heading>Subtasks</Heading>
        <SubtasksTable
          distributedTaskId={detailsData.id}
          data={data}
          totalRecordsCount={totalRecordsCount}
          {...this.props}
        />
      </>
    );
  };

  private renderErrors = (): ReactNode => {
    const { errors } = this.props;

    if (!errors) {
      return null;
    }

    return (
      <ErrorPage>
        <RequestErrorInfo error={errors} />

        <Link route="/distributed-tasks">
          <a>Go back to the list of distributed tasks</a>
        </Link>
      </ErrorPage>
    );
  };

  private renderActionButtons = (): ReactNode => {
    const { distributedTaskDefinitionId, detailsData } = this.props;

    const { deleteRequestPending } = this.state;

    if (!detailsData) {
      return null;
    }

    const inputDataUrl = `${
      config.serverUrl
    }/distributed-tasks/${distributedTaskDefinitionId}/input-data`;
    const resultsUrl = `${
      config.serverUrl
    }/distributed-tasks/${distributedTaskDefinitionId}/result`;

    const taskDone = detailsData.status === DistributedTaskStatus.Done;

    return (
      <Pane marginBottom={majorScale(2)}>
        <BackButton
          onClick={this.onBackButtonClick}
          marginRight={minorScale(2)}
        />

        <Button
          marginRight={minorScale(2)}
          iconBefore="trash"
          intent="danger"
          onClick={this.onDeleteButtonClick}
          disabled={deleteRequestPending}
        >
          Delete
        </Button>

        <Link route={`/distributed-tasks/${detailsData.id}/update`}>
          <Button iconBefore="edit" marginRight={minorScale(2)}>
            Edit
          </Button>
        </Link>

        <Pane marginRight={minorScale(2)} display="inline">
          <a href={inputDataUrl} download={true} className="without-underline">
            <Button iconBefore="download">Download input data</Button>
          </a>
        </Pane>

        <Pane marginRight={minorScale(2)} display="inline">
          <a
            href={taskDone ? resultsUrl : undefined}
            download={true}
            className="without-underline"
          >
            <Button iconBefore="download" intent="success" disabled={!taskDone}>
              Download results
            </Button>
          </a>
        </Pane>
      </Pane>
    );
  };

  private onDeleteButtonClick = () => {
    this.setState({ deleteRequestPending: true });

    this.props.kitsu
      .delete('distributed-task', this.props.distributedTaskDefinitionId)
      .then(() => {
        toaster.success('The task has been deleted');
        this.props.router.back();
      })
      .catch(() => {
        toaster.danger('Failed to delete the task');
      })
      .then(() => {
        this.setState({ deleteRequestPending: false });
      });
  };

  private onBackButtonClick = () => {
    this.props.router.back();
  };
}

export const DistributedTaskDetails = withRouter<
  DistributedTaskDetailsProps & DistributedTaskDetailsProps
>(withDependencies(dependenciesExtractor)(PureDistributedTaskDetails));
