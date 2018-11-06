import { Textarea } from 'evergreen-ui';
import { FieldProps } from 'formik';
import React, { StatelessComponent } from 'react';

import { withLabel } from '../with-label';
import { withValidation } from '../with-validation';

export const BaseTextarea: StatelessComponent<FieldProps> = ({
  field,
  form,
  ...props
}) => <Textarea {...field} {...props} />;

export const TextareaWithLabel = withLabel(BaseTextarea);
export const ValidatedTextareaWithLabel = withValidation(TextareaWithLabel);
