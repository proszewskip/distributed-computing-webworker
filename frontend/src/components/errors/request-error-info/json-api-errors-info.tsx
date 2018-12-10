import { JsonApiError } from 'kitsu';
import React, { StatelessComponent } from 'react';

import { ErrorInfo } from './error-info';

export interface JsonApiErrorsInfoProps {
  errors: JsonApiError[];
}

export const JsonApiErrorsInfo: StatelessComponent<JsonApiErrorsInfoProps> = ({
  errors,
}) => (
  <>
    {errors.map((error, index) => (
      <ErrorInfo key={index} title={error.title}>
        {error.detail}
      </ErrorInfo>
    ))}
  </>
);
