import { Button, TextInput } from 'evergreen-ui';
import { FormikActions, FormikProps, withFormik } from 'formik';
import fetch from 'isomorphic-unfetch';
import React from 'react';
import * as Yup from 'yup';

import { CreateDistributedTaskDefinition } from '../src/models/index';

import FilePicker from '../src/components/form/file-picker';
import ValidatedFormField from '../src/components/form/validated-form-field';

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
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  setFieldValue,
  setTouched,
}: FormikProps<CreateDistributedTaskDefinition>) => (
  <form onSubmit={handleSubmit}>
    <ValidatedFormField
      label="Name"
      labelFor="name"
      isRequired={true}
      isErrorVisible={touched.name === true}
      validationResult={errors.name}
    />
    <TextInput
      id="name"
      name="name"
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.name}
      width="30rem"
    />

    <ValidatedFormField
      label="Description"
      labelFor="description"
      isRequired={true}
    />
    <TextInput
      id="description"
      name="description"
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.description}
      height="6rem"
      width="30rem"
    />

    <ValidatedFormField
      label="MainDll"
      labelFor="MainDll"
      isRequired={true}
      isErrorVisible={touched.MainDll === true}
      validationResult={errors.MainDll}
    />
    <FilePicker
      name="MainDll"
      // tslint:disable-next-line:jsx-no-multiline-js jsx-no-lambda
      onChange={(fileList: FileList) => {
        setFieldValue('MainDll', fileList[0], true);
        setTouched({
          MainDll: true,
          ...touched,
        });
      }}
      accept=".dll"
      required={true}
    />

    <ValidatedFormField
      label="AdditionalDlls"
      labelFor="AdditionalDlls"
      isRequired={true}
      isErrorVisible={touched.AdditionalDlls === true}
      validationResult={errors.AdditionalDlls}
    />
    <FilePicker
      name="AdditionalDlls"
      // tslint:disable-next-line:jsx-no-multiline-js jsx-no-lambda
      onChange={(fileList: FileList) => {
        setFieldValue('AdditionalDlls', fileList, true);
        setTouched({
          AdditionalDlls: true,
          ...touched,
        });
      }}
      multiple={true}
      accept=".dll"
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
