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
import { FileList } from 'models';

const urlToFetch = `${config.serverIp}/distributed-task-definitions/add`;

interface CreateDistributedTaskDefinitionModel {
  name: string;
  description: string;
  MainDll: File | null;
  AdditionalDlls?: FileList;
}

interface CreateDistributedTaskDefinitionState {
  data: CreateDistributedTaskDefinitionModel;
}

export class CreateDistributedTaskDefinitionForm extends Component<
  {},
  CreateDistributedTaskDefinitionState
> {
  private validationSchema = Yup.object<
    CreateDistributedTaskDefinitionModel
  >().shape({
    name: Yup.string()
      .min(3, 'Must be longer than 3 characters')
      .required('Required'),
    description: Yup.string(),
    MainDll: Yup.mixed().test('Required', 'Required', (value) => {
      return value;
    }),
    AdditionalDlls: Yup.array<File>()
      .min(1, 'Required')
      .required('Required'),
  });

  constructor(props: any) {
    super(props);

    this.state = {
      data: {
        MainDll: null,
        name: '',
        description: '',
        AdditionalDlls: undefined,
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
  }: FormikProps<CreateDistributedTaskDefinitionModel>) => {
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
    response: JsonApiErrorResponse<CreateDistributedTaskDefinitionModel>,
  ) => {
    const errorsDictionary: Dictionary<string> = {};

    for (const [, value] of Object.entries(response.errors)) {
      if (value.title) {
        errorsDictionary[value.title] = value.detail ? value.detail : '';
      }
    }

    return errorsDictionary;
  };

  private buildFormData = (values: CreateDistributedTaskDefinitionModel) => {
    const formData = new FormData();
    if (values.MainDll) {
      formData.append('MainDll', values.MainDll);
    }

    if (values.AdditionalDlls) {
      for (const file of values.AdditionalDlls) {
        formData.append('AdditionalDlls', file);
      }
    }

    formData.append('name', values.name);
    formData.append('description', values.description);

    return formData;
  };

  private handleSubmitHandler = async (
    values: CreateDistributedTaskDefinitionModel,
    {
      setSubmitting,
      setErrors,
      resetForm,
    }: FormikActions<CreateDistributedTaskDefinitionModel>,
  ) => {
    setSubmitting(true);

    const formData = this.buildFormData(values);

    const response = await fetch(urlToFetch, {
      method: 'post',
      body: formData,
    });

    if (!response.ok) {
      const responseBody: CreateDistributedTaskDefinitionResponse = await response.json();

      const errorsDictionary = this.getErrorsDictionary(responseBody);

      setErrors(errorsDictionary);
    } else {
      alert('Distributed Task Definition added');
      resetForm(values);
    }
    setSubmitting(false);
  };
}
