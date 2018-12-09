import { Button, Pane } from 'evergreen-ui';
import { Field, Form, Formik, FormikActions, FormikProps } from 'formik';
import fetch from 'isomorphic-unfetch';
import { JsonApiErrorResponse } from 'kitsu';
import { Dictionary } from 'lodash';
import React, { Component } from 'react';
import { ClipLoader } from 'react-spinners';
import * as Yup from 'yup';

import { ErrorAlert } from 'components/form/errors/error-alert';
import { FilePickerWithLabel } from 'components/form/file-picker';
import { TextInputWithLabel } from 'components/form/text-input';
import { Textarea } from 'components/form/textarea';
import { WarnOnUnsavedForm } from 'components/form/with-warn-unsaved-form';

import { config } from 'config';

const urlToFetch = `${config.serverIp}/distributed-tasks/add`;

interface CreateDistributedTaskModel {
  DistributedTaskDefinitionId: number;
  name: string;
  description: string;
  priority: number;
  TrustLevelToComplete: number;
  InputData: File | null;
}

interface CreateDistributedTaskProps {
  id: number;
}

interface CreateDistributedTaskState {
  data: CreateDistributedTaskModel;
}

export class CreateDistributedTaskForm extends Component<
  CreateDistributedTaskProps,
  CreateDistributedTaskState
> {
  private validationSchema = Yup.object<CreateDistributedTaskModel>().shape({
    DistributedTaskDefinitionId: Yup.number().required('required'),
    name: Yup.string()
      .min(3, 'Must be longer than 3 characters')
      .required('Required'),
    description: Yup.string(),
    priority: Yup.number()
      .positive('Priority cannot be less than 0')
      .required('Required'),
    TrustLevelToComplete: Yup.number()
      .moreThan(0, 'Trust level to complete must be greater than 0')
      .required('Required'),
    InputData: Yup.mixed().test('Required', 'Required', (value) => {
      return value;
    }),
  });

  constructor(props: any) {
    super(props);

    this.state = {
      data: {
        name: '',
        description: '',
        DistributedTaskDefinitionId: props.id,
        InputData: null,
        TrustLevelToComplete: NaN,
        priority: NaN,
      },
    };
  }

  public render() {
    return (
      <Formik
        initialValues={this.state.data}
        onSubmit={this.handleSubmitHandler}
        render={this.renderForm}
        validationSchema={this.validationSchema}
      >
        {({ dirty }) => <WarnOnUnsavedForm warn={dirty} />}
      </Formik>
    );
  }

  private renderForm = ({
    values,
    touched,
    errors,
    isSubmitting,
  }: FormikProps<CreateDistributedTaskModel>) => {
    return (
      <Pane width="30%">
        <Form>
          <ErrorAlert touched={touched} errors={errors} values={values} />

          <Field
            name="name"
            label="Name"
            component={TextInputWithLabel}
            width="100%"
          />

          <Field
            name="description"
            label="Description"
            component={Textarea}
            width="100%"
            height="6rem"
          />

          <Field
            name="priority"
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

          <Button type="button" onClick={() => alert('Cancel')}>
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            Submit
          </Button>

          <ClipLoader loading={isSubmitting} />
        </Form>
      </Pane>
    );
  };

  private getErrorsDictionary = (
    response: JsonApiErrorResponse<CreateDistributedTaskModel>,
  ): Dictionary<string> => {
    const errorsDictionary: Dictionary<string> = {};

    for (const [, value] of Object.entries(response.errors)) {
      if (value.title) {
        errorsDictionary[value.title] = value.detail ? value.detail : '';
      }
    }

    return errorsDictionary;
  };

  private buildFormData = (values: CreateDistributedTaskModel): FormData => {
    const formData = new FormData();

    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('priority', values.priority.toString());
    formData.append(
      'TrustLevelToComplete',
      values.TrustLevelToComplete.toString(),
    );
    formData.append(
      'DistributedTaskDefinitionId',
      values.DistributedTaskDefinitionId.toString(),
    );

    if (values.InputData) {
      formData.append('InputData', values.InputData);
    }

    return formData;
  };

  private handleSubmitHandler = async (
    values: CreateDistributedTaskModel,
    {
      setSubmitting,
      setErrors,
      resetForm,
    }: FormikActions<CreateDistributedTaskModel>,
  ) => {
    setSubmitting(true);

    const formData = this.buildFormData(values);

    const response = await fetch(urlToFetch, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const responseBody: CreateDistributedTaskResponse = await response.json();

      const errorsDictionary = this.getErrorsDictionary(responseBody);

      setErrors(errorsDictionary);
    } else {
      alert('Distributed Task added');
      resetForm(values);
    }
    setSubmitting(false);
  };
}
