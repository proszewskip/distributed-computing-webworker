import { Button, Pane } from 'evergreen-ui';
import { Field, Form, Formik, FormikConfig } from 'formik';
import fetch from 'isomorphic-unfetch';
import React, { Component } from 'react';
import { ClipLoader } from 'react-spinners';
import * as Yup from 'yup';

import { ErrorAlert } from 'components/form/errors/error-alert';
import { FilePickerWithLabel } from 'components/form/file-picker';
import { TextInputWithLabel } from 'components/form/text-input';
import { Textarea } from 'components/form/textarea';
import { WarnOnUnsavedForm } from 'components/form/warn-on-unsaved-form';

import { getErrorsDictionary } from 'utils/get-errors-dictionary';
import { getFormData } from 'utils/get-form-data';

import { FileList } from 'models';
import { config } from 'product-specific';

const urlToFetch = `${config.serverUrl}/distributed-task-definitions/add`;

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
  public state: CreateDistributedTaskDefinitionState = {
    data: {
      MainDll: null,
      name: '',
      description: '',
      AdditionalDlls: undefined,
    },
  };

  private validationSchema = Yup.object<
    CreateDistributedTaskDefinitionModel
  >().shape({
    name: Yup.string()
      .min(3, 'Must be longer than 3 characters')
      .required('Required'),
    description: Yup.string(),
    MainDll: Yup.mixed().test('Required', 'Required', (value) => value),
    AdditionalDlls: Yup.array<File>()
      .min(1, 'Required')
      .required('Required'),
  });

  public render() {
    return (
      <Formik
        initialValues={this.state.data}
        onSubmit={this.handleSubmitHandler}
        render={this.renderForm}
        validationSchema={this.validationSchema}
      />
    );
  }

  private renderForm: FormikConfig<
    CreateDistributedTaskDefinitionModel
  >['render'] = ({ values, touched, errors, isSubmitting, dirty }) => {
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
        <WarnOnUnsavedForm warn={dirty} />
      </Pane>
    );
  };

  private handleSubmitHandler: FormikConfig<
    CreateDistributedTaskDefinitionModel
  >['onSubmit'] = async (values, { setSubmitting, setErrors, resetForm }) => {
    setSubmitting(true);

    const formData = getFormData(values);

    const response = await fetch(urlToFetch, {
      method: 'post',
      body: formData,
    });

    if (!response.ok) {
      const responseBody = await response.json();

      const errorsDictionary = getErrorsDictionary(responseBody);

      setErrors(errorsDictionary);
    } else {
      alert('Distributed Task Definition added');
      resetForm(values);
    }
    setSubmitting(false);
  };
}
