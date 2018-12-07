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

import { ErrorAlert } from 'components/form/errors/error-alert';
import { TextInputWithLabel } from 'components/form/text-input';
import { Textarea } from 'components/form/textarea';
import { withWarnOnUnsavedData } from 'components/form/with-warn-unsaved-form';

import { config } from 'config';

import { ServerError } from 'models';

// TODO: Fetch initial values

const urlToFetch = `${config.serverIp}/distributed-task-definitions`;

interface UpdateDistributedTaskDefinition {
  id: number;
  name: string;
  description: string;
}

const validationSchema = Yup.object<UpdateDistributedTaskDefinition>().shape({
  id: Yup.number().required(),
  name: Yup.string()
    .min(3, 'Must be longer than 3 characters')
    .required('Required'),
  description: Yup.string(),
});

type UpdateDistributedTaskDefinitionProps = FormikProps<
  UpdateDistributedTaskDefinition
> &
  UpdateDistributedTaskDefinition;

interface UpdateDistributedTaskDefinitionResponse {
  Errors: Dictionary<ServerError>;
}

const UpdateDistributedTaskDefinitionForm: StatelessComponent<
  UpdateDistributedTaskDefinitionProps
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
  props: UpdateDistributedTaskDefinition,
): UpdateDistributedTaskDefinition {
  return {
    id: props.id,
    name: props.name,
    description: props.description,
  };
}

function getErrorObject(
  response: UpdateDistributedTaskDefinitionResponse,
): Dictionary<string> {
  const errorObject: Dictionary<string> = {};

  for (const [, value] of Object.entries(response.Errors)) {
    errorObject[value.title] = value.detail;
  }

  return errorObject;
}

function buildFormData(values: UpdateDistributedTaskDefinition): FormData {
  const formData = new FormData();

  formData.append('name', values.name);
  formData.append('description', values.description);

  return formData;
}

async function handleSubmitHandler(
  values: UpdateDistributedTaskDefinition,
  { setSubmitting, setErrors }: FormikActions<UpdateDistributedTaskDefinition>,
) {
  setSubmitting(true);

  const formData = buildFormData(values);

  // TODO: Use client library compliant with JSON:API
  const response = await fetch(urlToFetch, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    const responseBody: UpdateDistributedTaskDefinitionResponse = await response.json();

    const errorObject = getErrorObject(responseBody);

    setErrors(errorObject);
  } else {
    alert('Distributed Task Definition updated');
  }
  setSubmitting(false);
}

const withFormikProps: WithFormikConfig<
  UpdateDistributedTaskDefinition,
  UpdateDistributedTaskDefinition
> = {
  handleSubmit: handleSubmitHandler,
  mapPropsToValues,
  validationSchema,
};

const FormWithWarn = withWarnOnUnsavedData(UpdateDistributedTaskDefinitionForm);
const UpdateDistributedTaskDefinitionWithFormik = withFormik(withFormikProps)(
  FormWithWarn,
);

export default UpdateDistributedTaskDefinitionWithFormik;
