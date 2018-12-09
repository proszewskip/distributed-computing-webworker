import centered from '@storybook/addon-centered';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { ErrorPage } from 'components/errors';

const stories = storiesOf('ErrorPage', module);

stories
  .addDecorator(centered)
  .add('default story page', () => (
    <ErrorPage>Customizable message, e.g. something happened.</ErrorPage>
  ));
