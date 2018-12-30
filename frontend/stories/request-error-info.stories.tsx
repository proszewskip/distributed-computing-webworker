import centered from '@storybook/addon-centered';
import { storiesOf } from '@storybook/react';
import { Card } from 'evergreen-ui';
import { JsonApiError } from 'kitsu';
import React from 'react';

import { transformRequestError } from 'error-handling';

import { RequestErrorInfo } from 'components/errors';

const stories = storiesOf('RequestErrorInfo', module);

stories
  .addDecorator(centered)
  .add('API errors', () => {
    const apiErrors: JsonApiError[] = [
      {
        title: 'Not found',
        detail: 'Description',
      },
      {
        title: 'Some other error',
      },
    ];

    return (
      <Card width={400}>
        <RequestErrorInfo
          error={{ type: 'jsonApiErrors', errors: apiErrors }}
        />
      </Card>
    );
  })
  .add('native error (e.g. network error)', () => {
    const error = transformRequestError(new Error('Example error'));

    return (
      <Card width={400}>
        <RequestErrorInfo error={error} />
      </Card>
    );
  });
