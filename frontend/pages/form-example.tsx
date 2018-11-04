import { Button, Pane } from 'evergreen-ui';
import { Field, FormikActions, FormikProps, withFormik } from 'formik';
import fetch from 'isomorphic-unfetch';
import React from 'react';
import { ClipLoader } from 'react-spinners';
import * as Yup from 'yup';

import { CreateDistributedTaskDefinition } from '../src/models/index';

import { ErrorAlert } from 'components/form/errors/error-alert';
import { FormikFilePicker } from 'components/form/file-picker/';
import { FormikTextInput } from 'components/form/text-input/';
import { FormikTextarea } from 'components/form/textarea';
import { withLabel } from 'components/form/with-label/hoc';
import { withValidation } from 'components/form/with-validation/hoc';

const serverIp = 'http://localhost:5000';
const entityPath = '/distributed-task-definitions/add';
const urlToFetch = `${serverIp}${entityPath}`;

const ValidatedTextInput = withValidation(FormikTextInput);
const ValidatedTextInputWithLabel = withLabel(ValidatedTextInput);

const TextareaWithLabel = withLabel(FormikTextarea);

const ValidatedFilePicker = withValidation(FormikFilePicker);
const ValidatedFilePickerWithLabel = withLabel(ValidatedFilePicker);

const ExampleForm = ({
  handleSubmit,
  isSubmitting,
  touched,
  errors,
  values,
}: FormikProps<CreateDistributedTaskDefinition>) => (
  <Pane width="30%">
    <form onSubmit={handleSubmit}>
      <ErrorAlert touched={touched} errors={errors} values={values} />

      <Field
        name="name"
        label="Name"
        component={ValidatedTextInputWithLabel}
        width="100%"
      />

      <Field
        name="description"
        label="Description"
        component={TextareaWithLabel}
        width="100%"
        height="6rem"
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

      <Button type="button" onClick={() => alert('Cancel')}>
        Cancel
      </Button>

      <Button type="submit" disabled={isSubmitting}>
        Submit
      </Button>

      <ClipLoader loading={isSubmitting} />
    </form>
  </Pane>
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
  formData.append('description', values.description);

  await fetch(urlToFetch, {
    method: 'post',
    body: formData,
  }).then(async (response: Response) => {
    if (!response.ok) {
      const result = await response.json();

      const errorObject: any = {};

      for (const error of result.Errors) {
        errorObject[error.title] = error.detail;
      }

      setErrors(errorObject);
    } else {
      alert('Distributed Task Definition added');
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
