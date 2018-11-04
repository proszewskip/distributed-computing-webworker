import { Button } from 'evergreen-ui';
import { Field, FormikActions, FormikProps, withFormik } from 'formik';
import fetch from 'isomorphic-unfetch';
import React from 'react';
import * as Yup from 'yup';

import { CreateDistributedTaskDefinition } from '../src/models/index';

import { FormikFilePicker } from 'components/form/file-picker/';
import { FormikTextInput } from 'components/form/text-input/';
import { withLabel } from 'components/form/with-label/hoc';
import { withValidation } from 'components/form/with-validation/hoc';

const serverIp = 'http://localhost:5000';
const entityPath = '/distributed-task-definitions/add';
const urlToFetch = `${serverIp}${entityPath}`;

const ValidatedFormTextInput = withValidation(FormikTextInput);
const ValidatedFormTextInputWithLabel = withLabel(ValidatedFormTextInput);
const FormTextInputWithLabel = withLabel(FormikTextInput);

const ValidatedFilePicker = withValidation(FormikFilePicker);
const ValidatedFilePickerWithLabel = withLabel(ValidatedFilePicker);

const ExampleForm = ({
  handleSubmit,
  isSubmitting,
}: FormikProps<CreateDistributedTaskDefinition>) => (
  <form onSubmit={handleSubmit}>
    <Field
      name="name"
      label="Name"
      component={ValidatedFormTextInputWithLabel}
    />

    <Field
      name="description"
      label="Description"
      component={FormTextInputWithLabel}
    />

    <Field
      name="MainDll"
      label="MainDll"
      component={ValidatedFilePickerWithLabel}
      accept=".dll"
    />

    <Field
      name="AdditionalDlls"
      label="AdditionalDlls"
      component={ValidatedFilePickerWithLabel}
      accept=".dll"
      multiple={true}
    />

    <Button type="submit" disabled={isSubmitting}>
      Submit
    </Button>
  </form>
);

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Must be longer than 3 characters')
    .required('Required'),
  MainDll: Yup.object()
    .nullable(true)
    .test('Defined', 'MainDll is required', (file: any) => file !== undefined),
  AdditionalDlls: Yup.array().required(),
});

function mapPropsToValues() {
  return {
    name: '',
    description: '',
    MainDll: undefined,
    AdditionalDlls: undefined,
  };
}

async function handleSubmitHandler(
  values: CreateDistributedTaskDefinition,
  { setSubmitting, setErrors }: FormikActions<CreateDistributedTaskDefinition>,
) {
  setSubmitting(true);
  const formData = new FormData();
  if (values.MainDll !== undefined) {
    formData.append('MainDll', values.MainDll);
  }

  if (values.AdditionalDlls !== undefined) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < values.AdditionalDlls.length; ++i) {
      formData.append('AdditionalDlls', values.AdditionalDlls[i]);
    }
  }

  formData.append('name', values.name);

  await fetch(urlToFetch, {
    method: 'post',
    body: formData,
  }).then(async (response: Response) => {
    if (!response.ok) {
      const result = await response.json();

      const errorObject: any = {};

      for (const error of result.Errors) {
        errorObject[error.Title] = error.detail;
      }

      setErrors(errorObject);
    }
    setSubmitting(false);
  });
}

const withFormikProps = {
  handleSubmit: handleSubmitHandler,
  mapPropsToValues,
  validationSchema,
};

const ExampleFormWithFormik = withFormik(withFormikProps)(ExampleForm);

const Basic = () => (
  <div>
    <h1>Example form</h1>
    <ExampleFormWithFormik />
  </div>
);

export default Basic;
