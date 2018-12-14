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

import { getDetailsGrid } from './get-details-grid';
import {
  DistributedTaskDetailsDependencies,
  DistributedTaskDetailsProps,
  PureDistributedTaskDetailsProps,
} from './types';

import { SubtasksTable } from 'features/subtasks/table/table';

const dependenciesExtractor: DependenciesExtractor<
  BaseDependencies,
  DistributedTaskDetailsDependencies
> = ({ kitsu }) => ({ kitsu });

export class PureDistributedTaskDetails extends PureComponent<
  PureDistributedTaskDetailsProps
> {
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

        {getDetailsGrid(detailsData)}

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

    if (!detailsData) {
      return null;
    }

    const inputDataUrl = `${
      config.serverUrl
    }/distributed-tasks/${distributedTaskDefinitionId}/input-data`;
    const resultsUrl = `${
      config.serverUrl
    }/distributed-tasks/${distributedTaskDefinitionId}/result`;

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
        >
          Delete
        </Button>

        <Link route={`/distributed-tasks/${distributedTaskDefinitionId}/edit`}>
          <Button iconBefore="edit" marginRight={minorScale(2)}>
            Edit
          </Button>
        </Link>

        <a href={inputDataUrl} download={true}>
          <Button marginRight={minorScale(2)} iconBefore="download">
            Download input data
          </Button>
        </a>

        {detailsData.status === DistributedTaskStatus.Done && (
          <a href={resultsUrl} download={true}>
            <Button
              marginRight={minorScale(2)}
              iconBefore="download"
              intent="success"
            >
              Download results
            </Button>
          </a>
        )}
      </Pane>
    );
  };

  private onDeleteButtonClick = () => {
    this.props.kitsu
      .delete('distributed-task', this.props.distributedTaskDefinitionId)
      .then(() => {
        toaster.success('The task has been deleted');
        this.props.router.back();
      });
  };

  private onBackButtonClick = () => {
    this.props.router.back();
  };
}

export const DistributedTaskDetails = withRouter<
  DistributedTaskDetailsProps & DistributedTaskDetailsProps
>(withDependencies(dependenciesExtractor)(PureDistributedTaskDetails));
