import { Alert, Paragraph } from 'evergreen-ui';
import { FormikErrors, FormikTouched, FormikValues } from 'formik';
import React, { StatelessComponent } from 'react';

interface ErrorAlertProps<V = any> {
  touched: FormikTouched<V>;
  errors: FormikErrors<V>;
  values: FormikValues;
}

export const ErrorAlert: StatelessComponent<ErrorAlertProps> = (
  errorAlertProps,
) => {
  const errorsAlertVisible = checkValidationResult(errorAlertProps);

  const errorsFromServer = getErrorsFromServer(errorAlertProps).map(
    (errorMessage) => (
      <Paragraph key={errorMessage}> {errorMessage} </Paragraph>
    ),
  );

  return (
    <>
      {errorsAlertVisible && (
        <Alert intent="danger" title="Form contains errors." />
      )}
      {errorsFromServer.length > 0 && (
        <Alert intent="danger" children={errorsFromServer} />
      )}
    </>
  );
};

const checkValidationResult = (errorAlertProps: ErrorAlertProps) => {
  const { touched, errors } = errorAlertProps;

  const fieldNames = Object.keys(errorAlertProps.values);

  return fieldNames.some(
    (key: string) => touched[key] !== undefined && errors[key] !== undefined,
  );
};

const getErrorsFromServer = (errorAlertProps: ErrorAlertProps) => {
  const fieldNames = Object.keys(errorAlertProps.values);
  const errorKeys = Object.keys(errorAlertProps.errors);

  const serverErrors = errorKeys.filter((key) => !fieldNames.includes(key));
  // TODO: use values after custom server errors are sent as `Detail`.

  return serverErrors;
};
