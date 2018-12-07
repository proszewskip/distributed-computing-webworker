import { storiesOf } from '@storybook/react';
import React, { StatelessComponent } from 'react';

import 'normalize.css';

import { UpdateDistributedTaskDefinition } from 'forms/distributed-task-definition/';

import MockNextContext from 'dependency-injection/mock-next-router';

const stories = storiesOf('Update Distributed Task Definition form', module);

const UpdateDistributedTaskDefinitionStory: StatelessComponent<{
  id: number;
}> = ({ id }) => (
  <MockNextContext>
    <UpdateDistributedTaskDefinition id={id} />
  </MockNextContext>
);

stories.add('id:5', () => <UpdateDistributedTaskDefinitionStory id={5} />);

stories.add('id:55', () => <UpdateDistributedTaskDefinitionStory id={55} />);
