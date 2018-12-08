import { Button, Heading, Pane } from 'evergreen-ui';
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

import { ErrorAlert } from 'components/form/errors/error-alert';
import { FilePickerWithLabel } from 'components/form/file-picker';
import { TextInputWithLabel } from 'components/form/text-input';
import { Textarea } from 'components/form/textarea';
import { withWarnOnUnsavedData } from 'components/form/with-warn-unsaved-form';
import { Layout, LayoutProps } from 'components/layout';

import { AuthenticatedSidebar, Head } from 'product-specific';

import { config } from 'config';
import { FileList, ServerError } from 'models';

const urlToFetch = `${config.serverIp}/distributed-task-definitions/add`;

interface CreateDistributedTaskDefinitionModel {
  name: string;
  description: string;
  MainDll: File | null;
  AdditionalDlls?: FileList;
}

const validationSchema = Yup.object<
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

type CreateDistributedTaskDefinitionProps = FormikProps<
  CreateDistributedTaskDefinitionModel
> &
  CreateDistributedTaskDefinitionModel;

interface CreateDistributedTaskDefinitionResponse {
  Errors: Dictionary<ServerError>;
}

const CreateDistributedTaskDefinitionForm: StatelessComponent<
  CreateDistributedTaskDefinitionProps
> = ({ handleSubmit, isSubmitting, touched, errors, values }) => (
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

function mapPropsToValues(
  props: CreateDistributedTaskDefinitionModel,
): CreateDistributedTaskDefinitionModel {
  return {
    name: props.name,
    description: props.description,
    MainDll: props.MainDll,
    AdditionalDlls: props.AdditionalDlls,
  };
}

function getErrorObject(
  response: CreateDistributedTaskDefinitionResponse,
): Dictionary<string> {
  const errorObject: Dictionary<string> = {};

  for (const [, value] of Object.entries(response.Errors)) {
    errorObject[value.title] = value.detail;
  }

  return errorObject;
}

function buildFormData(values: CreateDistributedTaskDefinitionModel): FormData {
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
}

async function handleSubmitHandler(
  values: CreateDistributedTaskDefinitionModel,
  {
    setSubmitting,
    setErrors,
    resetForm,
  }: FormikActions<CreateDistributedTaskDefinitionModel>,
) {
  setSubmitting(true);

  const formData = buildFormData(values);

  const response = await fetch(urlToFetch, {
    method: 'post',
    body: formData,
  });

  if (!response.ok) {
    const responseBody: CreateDistributedTaskDefinitionResponse = await response.json();

    const errorObject = getErrorObject(responseBody);

    setErrors(errorObject);
  } else {
    alert('Distributed Task Definition added');
    resetForm(values);
  }
  setSubmitting(false);
}

const withFormikProps: WithFormikConfig<
  CreateDistributedTaskDefinitionModel,
  CreateDistributedTaskDefinitionModel
> = {
  handleSubmit: handleSubmitHandler,
  mapPropsToValues,
  validationSchema,
};

const FormWithWarn = withWarnOnUnsavedData(CreateDistributedTaskDefinitionForm);
export const CreateDistributedTaskDefinitionWithFormik = withFormik(
  withFormikProps,
)(FormWithWarn);
