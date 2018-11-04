import { Alert } from 'evergreen-ui';
import { FormikErrors, FormikTouched } from 'formik';
import React from 'react';

interface ErrorAlertProps<V = any> {
  touched: FormikTouched<V>;
  errors: FormikErrors<V>;
}

export const ErrorAlert = (props: ErrorAlertProps) => {
  const errorsAlertVisible = areErrorsReported(props);

  return (
    <div>
      {errorsAlertVisible && (
        <Alert intent="danger" title="Form contains errors." />
      )}
    </div>
  );
};

const areErrorsReported = (errorAlertProps: ErrorAlertProps) => {
  const keys = Object.keys(errorAlertProps.touched);

  for (const key of keys) {
    if (errorAlertProps.touched[key] && errorAlertProps.errors[key]) {
      return true;
    }
  }

  return false;
};
