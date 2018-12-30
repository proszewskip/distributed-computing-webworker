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

import {
  ChangePasswordBody,
  ChangePasswordFields,
  ChangePasswordFormState,
  PureChangePasswordFormProps,
} from './types';
import { validationSchema } from './validation-schema';

const urlToFetch = `${config.serverUrl}/users/change-password`;

export class PureChangePasswordForm extends Component<
  PureChangePasswordFormProps,
  ChangePasswordFormState
> {
  public state: ChangePasswordFormState = {
    data: {
      'new-password': '',
      'old-password': '',
      'confirm-new-password': '',
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

  private renderForm: FormikConfig<ChangePasswordFields>['render'] = ({
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
            name="old-password"
            label="Old password"
            component={TextInputWithLabel}
            type="password"
            width="100%"
          />

          <Field
            name="new-password"
            label="New password"
            component={TextInputWithLabel}
            type="password"
            width="100%"
          />

          <Field
            name="confirm-new-password"
            label="Confirm new password"
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

  private onSubmit: FormikConfig<ChangePasswordBody>['onSubmit'] = async (
    values,
    { setSubmitting, setErrors, resetForm },
  ) => {
    setSubmitting(true);

    const changePasswordBody: ChangePasswordBody = {
      'new-password': values['new-password'],
      'old-password': values['old-password'],
    };

    const response = await fetch(urlToFetch, {
      method: 'post',
      body: JSON.stringify(changePasswordBody),
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
      toaster.success('Password changed successfully');
    }
    setSubmitting(false);
  };

  private onCancelClick = () => {
    this.props.router.back();
  };
}

export const ChangePasswordForm = withRouter(PureChangePasswordForm);
