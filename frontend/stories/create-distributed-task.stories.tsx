import { storiesOf } from '@storybook/react';
import React, { StatelessComponent } from 'react';

import 'normalize.css';

import { CreateDistributedTaskWithFormik } from 'forms/distributed-task/';

import MockNextContext from 'dependency-injection/mock-next-router';

const stories = storiesOf('Create Distributed Task form', module);

const CreateDistributedTaskStory: StatelessComponent = () => (
  <MockNextContext>
    <CreateDistributedTaskWithFormik
      name=""
      description=""
      priority={1}
      trust-level-to-complete={1}
      InputData={null}
    />
  </MockNextContext>
);

stories.add('Create', () => <CreateDistributedTaskStory />);
