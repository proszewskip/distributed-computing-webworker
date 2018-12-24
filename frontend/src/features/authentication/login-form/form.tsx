import { Pane, toaster } from 'evergreen-ui';
import { Field, Form, Formik, FormikConfig } from 'formik';
import React, { Component } from 'react';
import { ClipLoader } from 'react-spinners';

import { ErrorAlert } from 'components/form/errors/error-alert';
import { FormButtons } from 'components/form/form-buttons';
import { TextInputWithLabel } from 'components/form/text-input';
import { withRouter } from 'components/router';

import { getErrorsDictionary } from 'utils/forms/get-errors-dictionary';

import { config } from 'product-specific';

import { LoginFormState, LoginRequestBody, PureLoginFormProps } from './types';
import { validationSchema } from './validation-schema';

const urlToFetch = `${config.serverUrl}/users/login`;

export class PureLoginForm extends Component<
  PureLoginFormProps,
  LoginFormState
> {
  public state: LoginFormState = {
    data: {
      username: '',
      password: '',
    },
  };

  public render() {
    return (
      <Formik
        initialValues={this.state.data}
        validationSchema={validationSchema}
        render={this.renderForm}
        onSubmit={this.onSubmit}
      />
    );
  }

  private renderForm: FormikConfig<LoginRequestBody>['render'] = ({
    values,
    touched,
    errors,
    isSubmitting,
  }) => {
    return (
      <Pane maxWidth={600}>
        <Form>
          <ErrorAlert touched={touched} errors={errors} values={values} />

          <Field
            name="username"
            label="Username"
            component={TextInputWithLabel}
            width="100%"
          />

          <Field
            name="password"
            label="Password"
            component={TextInputWithLabel}
            type="password"
            width="100%"
          />

          <FormButtons
            isSubmitting={isSubmitting}
            onCancelClick={this.onCancelClick}
          />

          <ClipLoader loading={isSubmitting} />
        </Form>
      </Pane>
    );
  };

  private onSubmit: FormikConfig<LoginRequestBody>['onSubmit'] = async (
    values,
    { setSubmitting, setErrors, resetForm },
  ) => {
    setSubmitting(true);

    const { router } = this.props;

    const response = await fetch(urlToFetch, {
      method: 'post',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const responseBody = await response.json();
      const errorsDictionary = getErrorsDictionary(responseBody);

      setErrors(errorsDictionary);
    } else {
      resetForm();
      toaster.success('Logged in successfully');
      router.pushRoute('/');
    }
    setSubmitting(false);
  };

  private onCancelClick = () => {
    this.props.router.pushRoute('/');
  };
}

export const LoginForm = withRouter(PureLoginForm);
