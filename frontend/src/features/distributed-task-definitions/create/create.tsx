import { Button, Pane } from 'evergreen-ui';
import { Field, Form, Formik, FormikConfig } from 'formik';
import fetch from 'isomorphic-unfetch';
import { identity } from 'ramda';
import React, { Component } from 'react';
import { ClipLoader } from 'react-spinners';
import * as Yup from 'yup';

import { ErrorAlert } from 'components/form/errors/error-alert';
import { FilePickerWithLabel } from 'components/form/file-picker';
import { TextInputWithLabel } from 'components/form/text-input';
import { Textarea } from 'components/form/textarea';
import { WarnOnUnsavedData } from 'components/form/warn-on-unsaved-data';

import { getErrorsDictionary } from 'utils/get-errors-dictionary';
import { getFormData } from 'utils/get-form-data';

import {
  CreateDistributedTaskDefinitionModel,
  CreateDistributedTaskDefinitionState,
} from './types';

import { config } from 'product-specific';

const urlToFetch = `${config.serverUrl}/distributed-task-definitions/add`;

export class CreateDistributedTaskDefinitionForm extends Component<
  {},
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

  private validationSchema = Yup.object<
    CreateDistributedTaskDefinitionModel
  >().shape({
    Name: Yup.string()
      .min(3, 'Must be longer than 3 characters')
      .required('Required'),
    Description: Yup.string(),
    MainDll: Yup.mixed().test('Required', 'Required', identity),
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

          <Button type="button" onClick={() => alert('Cancel')}>
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
