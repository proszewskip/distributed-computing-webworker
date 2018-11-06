import { Textarea as EvergreenUITextarea } from 'evergreen-ui';
import { FieldProps } from 'formik';
import React, { StatelessComponent } from 'react';

import { withLabel } from '../with-label';
import { withValidation } from '../with-validation';

export const BaseTextarea: StatelessComponent<FieldProps> = ({
  field,
  form,
  ...props
}) => <EvergreenUITextarea {...field} {...props} />;

export const Textarea = withLabel(BaseTextarea);
export const ValidatedTextarea = withLabel(withValidation(EvergreenUITextarea));
