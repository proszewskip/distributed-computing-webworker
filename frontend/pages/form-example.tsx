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
import React, { StatelessComponent } from 'react';
import { ClipLoader } from 'react-spinners';
import * as Yup from 'yup';

import {
  CreateDistributedTaskDefinition,
  CreateDistributedTaskDefinitionResponse,
} from '../src/models/index';

import { ErrorAlert } from 'components/form/errors/error-alert';
import { FilePickerWithLabel } from 'components/form/file-picker';
import { TextInputWithLabel } from 'components/form/text-input';
import { Textarea } from 'components/form/textarea';
import { withWarnUnsavedData } from 'components/form/with-warn-unsaved-form';

const serverIp = 'http://localhost:5000';
const entityPath = '/distributed-task-definitions/add';
const urlToFetch = `${serverIp}${entityPath}`;

type ExampleFormProps = FormikProps<CreateDistributedTaskDefinition> &
  CreateDistributedTaskDefinition;

const ExampleForm: StatelessComponent<ExampleFormProps> = ({
  handleSubmit,
  isSubmitting,
  touched,
  errors,
  values,
}) => (
  <Pane width="30%">
    <form onSubmit={handleSubmit}>
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
    </form>
  </Pane>
);

const validationSchema = Yup.object<CreateDistributedTaskDefinition>().shape({
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

function mapPropsToValues(
  props: CreateDistributedTaskDefinition,
): CreateDistributedTaskDefinition {
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

  // TODO: extract construction of formData to another function
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

  const response = await fetch(urlToFetch, {
    method: 'post',
    body: formData,
  });

  if (!response.ok) {
    const result: CreateDistributedTaskDefinitionResponse = await response.json();

    // TODO: extract construction of errorObject to another function
    const errorObject: Dictionary<string> = {};

    for (const [, value] of Object.entries(result.Errors)) {
      errorObject[value.title] = value.detail;
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

const exampleFormWithWarn = withWarnUnsavedData(ExampleForm);
const ExampleFormWithFormik = withFormik(withFormikProps)(exampleFormWithWarn);

const Basic = () => (
  <div>
    <h1>Example form</h1>
    <ExampleFormWithFormik name="" description="" MainDll={null} />
  </div>
);

export default Basic;
