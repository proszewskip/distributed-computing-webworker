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
import { BaseDependencies } from 'product-specific';

import {
  DistributedTaskDetailsDependencies,
  DistributedTaskDetailsInitialProps,
  DistributedTaskDetailsProps,
  PureDistributedTaskDetailsProps,
} from './types';

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
    const { data, id } = this.props;

    if (!data) {
      return null;
    }

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
            <Text>{data.id}</Text>
          </Pane>

          <Pane>
            <Text>Name</Text>
          </Pane>
          <Pane>
            <Text>{data.name}</Text>
          </Pane>

          <Pane>
            <Text>Description</Text>
          </Pane>
          <Pane>
            <Text>{data.description}</Text>
          </Pane>

          <Pane>
            <Text>Priority</Text>
          </Pane>
          <Pane>
            <Text>{data.priority}</Text>
          </Pane>

          <Pane>
            <Text>Trust level to complete</Text>
          </Pane>
          <Pane>
            <Text>{data['trust-level-to-complete']}</Text>
          </Pane>

          <Pane>
            <Text>Status</Text>
          </Pane>
          <Pane>
            <Text>
              {(data.status === DistributedTaskStatus.Done && 'Done') ||
                (data.status === DistributedTaskStatus.Error &&
                  'Errors occured') ||
                (data.status === DistributedTaskStatus.InProgress &&
                  'In progress')}
            </Text>
          </Pane>
          <Pane>
            <Text>Errors</Text>
          </Pane>
          <Pane>
            <Text>
              {data.errors.map((error) => (
                <Alert title={error} intent="danger" />
              ))}
            </Text>
          </Pane>
        </Card>

        <Heading>Subtasks </Heading>
        <Text>In progress...</Text>
      </>
    );
  };

  private renderErrors = (): ReactNode => {
    const { error } = this.props;

    if (!error) {
      return null;
    }

    return (
      <ErrorPage>
        <RequestErrorInfo error={error} />

        <Link route="/distributed-tasks">
          <a>Go back to the list of distributed tasks</a>
        </Link>
      </ErrorPage>
    );
  };
}

export const DistributedTaskDetails = withRouter<
  DistributedTaskDetailsInitialProps & DistributedTaskDetailsProps
>(withDependencies(dependenciesExtractor)(PureDistributedTaskDetails));
