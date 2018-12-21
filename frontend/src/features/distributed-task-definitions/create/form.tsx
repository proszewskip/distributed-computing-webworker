import { Button, Pane, toaster } from 'evergreen-ui';
import { Field, Form, Formik, FormikConfig } from 'formik';
import fetch from 'isomorphic-unfetch';
import React, { Component } from 'react';
import { ClipLoader } from 'react-spinners';

import { ErrorAlert } from 'components/form/errors/error-alert';
import { FilePickerWithLabel } from 'components/form/file-picker';
import { TextInputWithLabel } from 'components/form/text-input';
import { Textarea } from 'components/form/textarea';
import { WarnOnUnsavedData } from 'components/form/warn-on-unsaved-data';

import { withRouter, WithRouterProps } from 'components/router';

import { getErrorsDictionary } from 'utils/forms/get-errors-dictionary';
import { getFormData } from 'utils/forms/get-form-data';

import {
  CreateDistributedTaskDefinitionModel,
  CreateDistributedTaskDefinitionState,
} from './types';
import { validationSchema } from './validation-schema';

import { config } from 'product-specific';

const urlToFetch = `${config.serverUrl}/distributed-task-definitions/add`;

export class PureCreateDistributedTaskDefinitionForm extends Component<
  WithRouterProps,
  CreateDistributedTaskDefinitionState
> {
  public state: CreateDistributedTaskDefinitionState = {
    data: {
      MainDll: null,
      Name: '',
      Description: '',
      AdditionalDlls: undefined,
    },
  };

  public render() {
    return (
      <Formik
        initialValues={this.state.data}
        onSubmit={this.handleSubmitHandler}
        render={this.renderForm}
        validationSchema={validationSchema}
      />
    );
  }

  private renderForm: FormikConfig<
    CreateDistributedTaskDefinitionModel
  >['render'] = ({ values, touched, errors, isSubmitting, dirty }) => {
    return (
      <Pane maxWidth={600}>
        <Form>
          <ErrorAlert touched={touched} errors={errors} values={values} />

          <Field
            name="Name"
            label="Name"
            component={TextInputWithLabel}
            width="100%"
          />

          <Field
            name="Description"
            label="Description"
            component={Textarea}
            width="100%"
            height="6rem"
          />

          <Field
            name="MainDll"
            label="MainDll"
            component={FilePickerWithLabel}
            accept=".dll"
          />

          <Field
            name="AdditionalDlls"
            label="AdditionalDlls"
            component={FilePickerWithLabel}
            accept=".dll"
            multiple={true}
          />

          <Button type="button" onClick={this.onCancelClick}>
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting} appearance="primary">
            Submit
          </Button>

          <ClipLoader loading={isSubmitting} />
        </Form>
        <WarnOnUnsavedData warn={dirty} />
      </Pane>
    );
  };

  private handleSubmitHandler: FormikConfig<
    CreateDistributedTaskDefinitionModel
  >['onSubmit'] = async (values, { setSubmitting, setErrors, resetForm }) => {
    setSubmitting(true);

    const { router } = this.props;

    const formData = getFormData(values);

    const response = await fetch(urlToFetch, {
      method: 'post',
      body: formData,
    });

    const responseBody = await response.json();
    if (!response.ok) {
      const errorsDictionary = getErrorsDictionary(responseBody);

      setErrors(errorsDictionary);
    } else {
      const createdEntityId = responseBody.data.id;

      toaster.success('Distributed Task Definition added');
      resetForm();
      router.pushRoute(`/distributed-task-definitions/${createdEntityId}`);
    }
    setSubmitting(false);
  };

  private onCancelClick = () => {
    this.props.router.pushRoute('/distributed-task-definitions');
  };
}

export const CreateDistributedTaskDefinitionForm = withRouter(
  PureCreateDistributedTaskDefinitionForm,
);
