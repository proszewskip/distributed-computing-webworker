import { Alert } from 'evergreen-ui';
import { FormikErrors, FormikTouched, FormikValues } from 'formik';
import React from 'react';

interface ErrorAlertProps<V = any> {
  touched: FormikTouched<V>;
  errors: FormikErrors<V>;
  values: FormikValues;
}

export const ErrorAlert = (props: ErrorAlertProps) => {
  const errorsAlertVisible = checkValidationResult(props);
  const errorsFromServer = getErrorsFromServer(props).map((errorMessage) => (
    <Alert intent="danger" title={errorMessage} />
  ));

  return (
    <div>
      {errorsAlertVisible && (
        <Alert intent="danger" title="Form contains errors." />
      )}
      {errorsFromServer}
    </div>
  );
};

const checkValidationResult = (errorAlertProps: ErrorAlertProps) => {
  const valuesKeys = Object.keys(errorAlertProps.values);

  for (const key of valuesKeys) {
    if (errorAlertProps.touched[key] && errorAlertProps.errors[key]) {
      return true;
    }
  }

  return false;
};

const getErrorsFromServer = (errorAlertProps: ErrorAlertProps) => {
  const valuesKeys = Object.keys(errorAlertProps.values);
  const errorKeys = Object.keys(errorAlertProps.errors);

  const serverErrors: string[] = [];

  for (const key of errorKeys) {
    if (valuesKeys.indexOf(key) === -1) {
      // TODO: use values after custom server errors are sent as `Detail`.
      serverErrors.push(key);
    }
  }

  return serverErrors;
};
