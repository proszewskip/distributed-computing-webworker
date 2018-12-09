import {
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

import { BaseDependencies } from 'product-specific';

import {
  DistributedTaskDefinitionDetailsDependencies,
  DistributedTaskDefinitionDetailsInitialProps,
  DistributedTaskDefinitionDetailsProps,
  PureDistributedTaskDefinitionDetailsProps,
} from './types';

const dependenciesExtractor: DependenciesExtractor<
  BaseDependencies,
  DistributedTaskDefinitionDetailsDependencies
> = ({ kitsu }) => ({ kitsu });

export class PureDistributedTaskDefinitionDetails extends PureComponent<
  PureDistributedTaskDefinitionDetailsProps
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

    const problemPluginInfo = data['problem-plugin-info'];

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

          <Link route={`/distributed-task-definitions/${id}/edit`}>
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
          <Pane>{data.description}</Pane>

          <Pane>
            <Text>Main DLL name</Text>
          </Pane>
          <Pane>
            <Text>{data['main-dll-name']}</Text>
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

        <Heading>Distributed Tasks</Heading>
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

        <Link route="/distributed-task-definitions">
          <a>Go back to the list of distributed task definitions</a>
        </Link>
      </ErrorPage>
    );
  };
}

export const DistributedTaskDefinitionDetails = withRouter<
  DistributedTaskDefinitionDetailsInitialProps &
    DistributedTaskDefinitionDetailsProps
>(
  withDependencies(dependenciesExtractor)(PureDistributedTaskDefinitionDetails),
);
