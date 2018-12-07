import { storiesOf } from '@storybook/react';
import React, { StatelessComponent } from 'react';

import 'normalize.css';

import { UpdateDistributedTask } from 'forms/distributed-task/';

import MockNextContext from 'dependency-injection/mock-next-router';

const stories = storiesOf('Update Distributed Task form', module);

const UpdateDistributedTaskStory: StatelessComponent<{ id: number }> = ({
  id,
}) => (
  <MockNextContext>
    <UpdateDistributedTask id={id} />
  </MockNextContext>
);

stories.add('id:2', () => <UpdateDistributedTaskStory id={2} />);

stories.add('id:55', () => <UpdateDistributedTaskStory id={55} />);
