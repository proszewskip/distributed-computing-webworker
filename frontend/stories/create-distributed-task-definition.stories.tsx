import { storiesOf } from '@storybook/react';
import React, { StatelessComponent } from 'react';

import 'normalize.css';

import MockNextContext from 'dependency-injection/mock-next-router';

import { CreateDistributedTaskDefinitionWithFormik } from 'forms/distributed-task-definition';

const stories = storiesOf('Create Distributed Task Definition form', module);

const CreateDistributedTaskStory: StatelessComponent = () => (
  <MockNextContext>
    <CreateDistributedTaskDefinitionWithFormik
      name=""
      description=""
      MainDll={null}
    />
  </MockNextContext>
);

stories.add('Create', () => <CreateDistributedTaskStory />);
