import { Alert, Card, majorScale, minorScale, Pane, Text } from 'evergreen-ui';
import React, { StatelessComponent } from 'react';

import { Link } from 'components/link';

import { formatDistributedTaskStatus } from './format-distributed-task-status';

import { DistributedTaskWithDefinition } from './types';

export interface DetailsGridProps {
  details: DistributedTaskWithDefinition;
}

export const DetailsGrid: StatelessComponent<DetailsGridProps> = ({
  details,
}) => {
  const distributedTaskDefinition = details['distributed-task-definition'];

  return (
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
        <Text>{details.id}</Text>
      </Pane>

      <Pane>
        <Text>Name</Text>
      </Pane>
      <Pane>
        <Text>{details.name}</Text>
      </Pane>

      <Pane>
        <Text>Description</Text>
      </Pane>
      <Pane>
        <Text>{details.description}</Text>
      </Pane>

      <Pane>
        <Text>Priority</Text>
      </Pane>
      <Pane>
        <Text>{details.priority}</Text>
      </Pane>

      <Pane>
        <Text>Trust level to complete</Text>
      </Pane>
      <Pane>
        <Text>{details['trust-level-to-complete']}</Text>
      </Pane>

      <Pane>
        <Text>Status</Text>
      </Pane>
      <Pane>
        <Text>{formatDistributedTaskStatus(details.status)}</Text>
      </Pane>

      <Pane>
        <Text>Distributed Task Definition</Text>
      </Pane>
      <Pane>
        <Link
          route={`/distributed-task-definitions/${
            distributedTaskDefinition.id
          }`}
        >
          <a>
            <Text>{distributedTaskDefinition.name}</Text>
          </a>
        </Link>
      </Pane>

      {details.errors.length > 0 && (
        <>
          <Pane>
            <Text>Errors</Text>
          </Pane>
          <Pane>
            <Text>
              {details.errors.map((error, index) => (
                <Alert key={index} intent="danger">
                  <Text wordBreak="break-all">{error}</Text>
                </Alert>
              ))}
            </Text>
          </Pane>
        </>
      )}
    </Card>
  );
};
