import { Textarea } from 'evergreen-ui';
import { FieldProps } from 'formik';
import React from 'react';

export const FormikTextArea = (fieldProps: FieldProps) => {
  const { field, form, ...props } = fieldProps;

  return (
    <div>
      <Textarea {...field} {...props} />
    </div>
  );
};
