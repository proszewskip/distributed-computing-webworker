import { Button } from 'evergreen-ui';
import { FormikActions, FormikProps, withFormik, Field } from 'formik';
import fetch from 'isomorphic-unfetch';
import React from 'react';
import * as Yup from 'yup';

import { CreateDistributedTaskDefinition } from '../src/models/index';

import ValidatedTextInput from 'components/form/validated-text-input';
import ValidatedFilePicker from 'components/form/validated-file-picker';

const serverIp = 'http://localhost:5000';
const entityPath = '/distributed-task-definitions/add';
const urlToFetch = `${serverIp}${entityPath}`;

const ValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Must be longer than 3 characters')
    .required('Required'),
  MainDll: Yup.object()
    .nullable(true)
    .test('Defined', 'MainDll is required', (file: any) => file !== undefined),
  AdditionalDlls: Yup.array().required(),
});

const ExampleForm = ({
  handleSubmit,
  isSubmitting,
}: FormikProps<CreateDistributedTaskDefinition>) => (
  <form onSubmit={handleSubmit}>
    <Field name="name" label="Name" component={ValidatedTextInput} />
    <Field
      name="description"
      label="Description"
      component={ValidatedTextInput}
    />
    <Field
      name="MainDll"
      label="MainDll"
      component={ValidatedFilePicker}
      accept=".dll"
    />

    <Field
      name="AdditionalDlls"
      label="AdditionalDlls"
      component={ValidatedFilePicker}
      accept=".dll"
      multiple={true}
    />

    <Button type="submit" disabled={isSubmitting}>
      Submit
    </Button>
  </form>
);

const ExampleFormWithFormik = withFormik({
  mapPropsToValues: () => ({
    name: '',
    description: '',
    MainDll: undefined,
    AdditionalDlls: undefined,
  }),
  validationSchema: ValidationSchema,
  handleSubmit: (
    values: CreateDistributedTaskDefinition,
    {
      setSubmitting,
      setErrors,
    }: FormikActions<CreateDistributedTaskDefinition>,
  ) => {
    setTimeout(async () => {
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
    }, 500);
  },
})(ExampleForm);

const Basic = () => (
  <div>
    <h1>Example form</h1>
    <ExampleFormWithFormik />
  </div>
);

export default Basic;
