import { Alert, Pane } from 'evergreen-ui';
import { FormikErrors, FormikTouched, FormikValues } from 'formik';
import React, { StatelessComponent } from 'react';

interface FormError {
  title: string;
  message?: string;
}

interface ErrorAlertProps<V = any> {
  touched: FormikTouched<V>;
  errors: FormikErrors<V>;
  values: FormikValues;
}

/**
 * An alter that displays form errors (both validation-related and server-side).
 *
 * @param errorAlertProps
 */
export const ErrorAlert: StatelessComponent<ErrorAlertProps> = (
  errorAlertProps,
) => {
  const errorsAlertVisible = hasFormErrors(errorAlertProps);

  const errorsFromServer = getServerErrorAlerts(errorAlertProps);

  return (
    <>
      {errorsAlertVisible && (
        <Alert intent="danger" title="Form contains errors." />
      )}
      {errorsFromServer.length > 0 && <Pane>{errorsFromServer}</Pane>}
    </>
  );
};

const getServerErrorAlerts = (errorAlertProps: ErrorAlertProps) => {
  const errorsFromServer = getErrorsFromServer(errorAlertProps);

  const alertsList = errorsFromServer.map((error, index) => (
    <Alert key={index} title={error.title} intent="danger">
      {error.message}
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

  const serverErrors: FormError[] = [];

  for (const key of serverErrorsKeys) {
    serverErrors.push({ title: key, message: errors[key] as string });
  }

  return serverErrors;
};
