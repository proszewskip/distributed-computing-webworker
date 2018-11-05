import { TextInput } from 'evergreen-ui';
import { FieldProps } from 'formik';
import React, { StatelessComponent } from 'react';

import { withLabel } from '../with-label';
import { withValidation } from '../with-validation';

export const BaseTextinput: StatelessComponent<FieldProps> = (fieldProps) => {
  const { field, form, ...props } = fieldProps;

  return <TextInput {...field} {...props} />;
};

export const ValidatedTextInput = withValidation(BaseTextinput);
export const ValidatedTextInputWithLabel = withLabel(ValidatedTextInput);
