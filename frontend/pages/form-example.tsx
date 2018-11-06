import { Button, Pane } from 'evergreen-ui';
import {
  Field,
  FormikActions,
  FormikProps,
  withFormik,
  WithFormikConfig,
} from 'formik';
import fetch from 'isomorphic-unfetch';
import { Dictionary } from 'lodash';
import React from 'react';
import { ClipLoader } from 'react-spinners';
import * as Yup from 'yup';

import {
  CreateDistributedTaskDefinition,
  CreateDistributedTaskDefinitionResponse,
} from '../src/models/index';

import { ErrorAlert } from 'components/form/errors/error-alert';
import { FilePickerWithLabel } from 'components/form/file-picker';
import { ValidatedTextInputWithLabel } from 'components/form/text-input';
import { TextareaWithLabel } from 'components/form/textarea';

const serverIp = 'http://localhost:5000';
const entityPath = '/distributed-task-definitions/add';
const urlToFetch = `${serverIp}${entityPath}`;

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
    </form>
  </Pane>
);

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Must be longer than 3 characters')
    .required('Required'),
  description: Yup.string(),
  MainDll: Yup.object()
    .nullable(true)
    .test('Defined', 'MainDll is required', (file: any) => file !== undefined),
  AdditionalDlls: Yup.array().required(),
});

function mapPropsToValues(props: CreateDistributedTaskDefinition) {
  return {
    name: props.name,
    description: props.description,
    MainDll: props.MainDll,
    AdditionalDlls: props.AdditionalDlls,
  };
}

async function handleSubmitHandler(
  values: CreateDistributedTaskDefinition,
  { setSubmitting, setErrors }: FormikActions<CreateDistributedTaskDefinition>,
) {
  setSubmitting(true);
  const formData = new FormData();
  if (values.MainDll) {
    formData.append('MainDll', values.MainDll);
  }

  if (values.AdditionalDlls) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < values.AdditionalDlls.length; ++i) {
      formData.append('AdditionalDlls', values.AdditionalDlls[i]);
    }
  }

  formData.append('name', values.name);
  formData.append('description', values.description);

  const response: Response = await fetch(urlToFetch, {
    method: 'post',
    body: formData,
  });

  if (!response.ok) {
    const result: CreateDistributedTaskDefinitionResponse = await response.json();

    const errorObject: Dictionary<string> = {};

    for (const error of result.Errors) {
      errorObject[error.title] = error.detail;
    }

    setErrors(errorObject);
  } else {
    alert('Distributed Task Definition added');
  }
  setSubmitting(false);
}

const withFormikProps: WithFormikConfig<
  CreateDistributedTaskDefinition,
  CreateDistributedTaskDefinition
> = {
  handleSubmit: handleSubmitHandler,
  mapPropsToValues,
  validationSchema,
};

const ExampleFormWithFormik = withFormik(withFormikProps)(ExampleForm);

const Basic = () => (
  <div>
    <h1>Example form</h1>
    <ExampleFormWithFormik
      name=""
      description=""
      MainDll={undefined}
      AdditionalDlls={undefined}
    />
  </div>
);

export default Basic;
