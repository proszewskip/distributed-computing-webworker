import { Textarea } from 'evergreen-ui';
import { FieldProps } from 'formik';
import React, { StatelessComponent } from 'react';

import { withLabel } from '../with-label';

export const BaseTextarea: StatelessComponent<FieldProps> = (fieldProps) => {
  const { field, form, ...props } = fieldProps;

  return <Textarea {...field} {...props} />;
};

export const TextareaWithLabel = withLabel(BaseTextarea);
