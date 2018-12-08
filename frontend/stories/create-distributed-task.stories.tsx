import { storiesOf } from '@storybook/react';
import React, { StatelessComponent } from 'react';

import 'normalize.css';

import { CreateDistributedTaskWithFormik } from 'forms/distributed-task/';

import MockNextContext from 'dependency-injection/mock-next-router';

const stories = storiesOf('Create Distributed Task form', module);

const CreateDistributedTaskStory: StatelessComponent<{ id: number }> = ({
  id,
}) => (
  <MockNextContext>
    <CreateDistributedTaskWithFormik
      name=""
      description=""
      priority={1}
      TrustLevelToComplete={1}
      InputData={null}
      DistributedTaskDefinitionId={id}
    />
  </MockNextContext>
);

stories.add('Create id:1', () => <CreateDistributedTaskStory id={1} />);

stories.add('Create id:5', () => <CreateDistributedTaskStory id={5} />);
