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

import { withRouter } from 'components/router';

import { getErrorsDictionary } from 'utils/forms/get-errors-dictionary';
import { getFormData } from 'utils/forms/get-form-data';

import {
  CreateDistributedTaskModel,
  CreateDistributedTaskProps,
  CreateDistributedTaskState,
} from './types';
import { validationSchema } from './validation-schema';

import { config } from 'product-specific';

const urlToFetch = `${config.serverUrl}/distributed-tasks/add`;

export class PureCreateDistributedTaskForm extends Component<
  CreateDistributedTaskProps,
  CreateDistributedTaskState
> {
  public state: CreateDistributedTaskState = {
    data: {
      Name: '',
      Description: '',
      DistributedTaskDefinitionId: this.props.distributedTaskDefinitionId,
      InputData: null,
      TrustLevelToComplete: 1,
      Priority: 1,
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

  private renderForm: FormikConfig<CreateDistributedTaskModel>['render'] = ({
    values,
    touched,
    errors,
    isSubmitting,
    dirty,
  }) => {
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
            name="Priority"
            label="Priority"
            type="number"
            component={TextInputWithLabel}
            width="100%"
          />

          <Field
            name="TrustLevelToComplete"
            label="Trust level to complete"
            type="number"
            component={TextInputWithLabel}
            width="100%"
          />

          <Field
            name="InputData"
            label="Task input"
            component={FilePickerWithLabel}
          />

          <Button type="button" onClick={this.onCancelClick}>
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            Submit
          </Button>

          <ClipLoader loading={isSubmitting} />
        </Form>
        <WarnOnUnsavedData warn={dirty} />
      </Pane>
    );
  };

  private handleSubmitHandler: FormikConfig<
    CreateDistributedTaskModel
  >['onSubmit'] = async (values, { setSubmitting, setErrors, resetForm }) => {
    setSubmitting(true);

    const { router } = this.props;

    const formData = getFormData(values);

    const response = await fetch(urlToFetch, {
      method: 'POST',
      body: formData,
    });

    const responseBody = await response.json();

    if (!response.ok) {
      const errorsDictionary = getErrorsDictionary(responseBody);

      setErrors(errorsDictionary);
    } else {
      const createdEntityId = responseBody.data.id;

      toaster.success('Distributed Task added');
      resetForm();
      router.pushRoute(`/distributed-tasks/${createdEntityId}`);
    }
    setSubmitting(false);
  };

  private onCancelClick = () => {
    const { router, distributedTaskDefinitionId } = this.props;

    router.pushRoute(
      `/distributed-task-definitions/${distributedTaskDefinitionId}`,
    );
  };
}

export const CreateDistributedTaskForm = withRouter(
  PureCreateDistributedTaskForm,
);
