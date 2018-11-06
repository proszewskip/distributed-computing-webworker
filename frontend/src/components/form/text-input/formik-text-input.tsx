import { TextInput as EvergreenUITextInput } from 'evergreen-ui';
import { FieldProps } from 'formik';
import React, { StatelessComponent } from 'react';

import { withLabel } from '../with-label';
import { withValidation } from '../with-validation';

export const BaseTextInput: StatelessComponent<FieldProps> = ({
  field,
  form,
  ...props
}) => <EvergreenUITextInput {...field} {...props} />;

export const TextInput = withValidation(BaseTextInput);
export const TextInputWithLabel = withLabel(TextInput);
