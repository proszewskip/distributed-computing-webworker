import { Alert, Pane } from 'evergreen-ui';
import { FormikErrors, FormikTouched, FormikValues } from 'formik';
import { Dictionary } from 'ramda';
import React, { StatelessComponent } from 'react';

interface ErrorAlertProps<V = any> {
  touched: FormikTouched<V>;
  errors: FormikErrors<V>;
  values: FormikValues;
}

export const ErrorAlert: StatelessComponent<ErrorAlertProps> = (
  errorAlertProps,
) => {
  const errorsAlertVisible = hasFormErrors(errorAlertProps);

  const errorsFromServer = getServerAlerts(errorAlertProps);

  return (
    <>
      {errorsAlertVisible && (
        <Alert intent="danger" title="Form contains errors." />
      )}
      {errorsFromServer.length > 0 && <Pane>{errorsFromServer}</Pane>}
    </>
  );
};

const getServerAlerts = (errorAlertProps: ErrorAlertProps) => {
  const errorsFromServer = getErrorsFromServer(errorAlertProps);

  const alertsList = Object.keys(errorsFromServer).map((title, index) => (
    <Alert key={index} title={title} intent="danger">
      {errorsFromServer[title]}
    </Alert>
  ));

  return alertsList;
};

const hasFormErrors = ({ touched, errors, values }: ErrorAlertProps) => {
  const fieldNames = Object.keys(values);

  return fieldNames.some(
    (key: string) => touched[key] !== undefined && errors[key] !== undefined,
  );
};

const getErrorsFromServer = ({ errors, values }: ErrorAlertProps) => {
  const fieldNames = Object.keys(values);
  const errorKeys = Object.keys(errors);

  const serverErrorsKeys = errorKeys.filter((key) => !fieldNames.includes(key));

  const serverErrors: Dictionary<string | undefined> = {};

  for (const key of serverErrorsKeys) {
    serverErrors[key] = errors[key] as any;
  }

  return serverErrors;
};
