import {
  Alert,
  BackButton,
  Button,
  Card,
  Heading,
  majorScale,
  minorScale,
  Pane,
  Text,
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

import {
  DistributedTaskDetailsDependencies,
  DistributedTaskDetailsInitialProps,
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
    const { detailsData, id, tableData } = this.props;

    if (!detailsData || !tableData) {
      return null;
    }

    const { data, totalRecordsCount } = tableData;

    return (
      <>
        <Pane marginBottom={majorScale(2)}>
          <BackButton
            onClick={this.props.onBackButtonClick}
            marginRight={minorScale(2)}
          />

          <Button
            marginRight={minorScale(2)}
            iconBefore="trash"
            intent="danger"
            onClick={this.props.onDeleteButtonClick}
          >
            Delete
          </Button>

          <Link route={`/distributed-tasks/${id}/edit`}>
            <Button iconBefore="edit" marginRight={minorScale(2)}>
              Edit
            </Button>
          </Link>

          <Button
            marginRight={minorScale(2)}
            iconBefore="download"
            onClick={this.downloadInput}
          >
            Download input
          </Button>

          {detailsData.status === DistributedTaskStatus.Done && (
            <Button
              marginRight={minorScale(2)}
              iconBefore="download"
              intent="success"
              onClick={this.downloadResult}
            >
              Download result
            </Button>
          )}
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
            <Text>Priority</Text>
          </Pane>
          <Pane>
            <Text>{detailsData.priority}</Text>
          </Pane>

          <Pane>
            <Text>Trust level to complete</Text>
          </Pane>
          <Pane>
            <Text>{detailsData['trust-level-to-complete']}</Text>
          </Pane>

          <Pane>
            <Text>Status</Text>
          </Pane>
          <Pane>
            <Text>
              {(detailsData.status === DistributedTaskStatus.Done && 'Done') ||
                (detailsData.status === DistributedTaskStatus.Error &&
                  'Errors occured') ||
                (detailsData.status === DistributedTaskStatus.InProgress &&
                  'In progress')}
            </Text>
          </Pane>
          {detailsData.errors.length > 0 && (
            <>
              <Pane>
                <Text>Errors</Text>
              </Pane>
              <Pane>
                <Text>
                  {detailsData.errors.map((error) => (
                    <Alert title={error} intent="danger" />
                  ))}
                </Text>
              </Pane>
            </>
          )}
        </Card>

        <Heading>Subtasks </Heading>
        <SubtasksTable
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

  private downloadInput = () => {
    const { id } = this.props;

    window.open(
      `${config.serverUrl}/distributed-tasks/${id}/input-data`,
      '_blank',
    );
  };

  private downloadResult = () => {
    const { id } = this.props;

    window.open(`${config.serverUrl}/distributed-tasks/${id}/result`, '_blank');
  };
}

export const DistributedTaskDetails = withRouter<
  DistributedTaskDetailsInitialProps & DistributedTaskDetailsProps
>(withDependencies(dependenciesExtractor)(PureDistributedTaskDetails));
