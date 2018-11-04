import { TextInput } from 'evergreen-ui';
import { FieldProps } from 'formik';
import React from 'react';

export const FormikTextInput = (fieldProps: FieldProps) => {
  const { field, form, ...props } = fieldProps;

  return (
    <div>
      <TextInput {...field} {...props} />
    </div>
  );
};
