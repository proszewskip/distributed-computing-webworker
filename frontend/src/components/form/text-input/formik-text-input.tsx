import { TextInput } from 'evergreen-ui';
import { FieldProps } from 'formik';
import React from 'react';

export const FormikTextInput = (props: FieldProps) => {
  const { field } = props;

  return (
    <div>
      <TextInput {...field} />
    </div>
  );
};
