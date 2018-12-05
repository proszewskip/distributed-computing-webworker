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

const urlToFetch = `${config.serverIp}/distributed-tasks`;

interface UpdateDistributedTask {
  name: string;
  description: string;
  priority: number;
  'trust-level-to-complete': number;
}

const validationSchema = Yup.object<UpdateDistributedTask>().shape({
  name: Yup.string()
    .min(3, 'Must be longer than 3 characters')
    .required('Required'),
  description: Yup.string(),
  priority: Yup.number()
    .positive('Priority cannot be less than 0')
    .required(),
  'trust-level-to-complete': Yup.number()
    .moreThan(0, 'Trust level to complete must be greater than 0')
    .required(),
});

type UpdateDistributedTaskProps = FormikProps<UpdateDistributedTask> &
  UpdateDistributedTask;

interface UpdateDistributedTaskResponse {
  Errors: Dictionary<ServerError>;
}

const UpdateDistributedTaskForm: StatelessComponent<
  UpdateDistributedTaskProps
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
        name="priority"
        label="Priority"
        type="number"
        component={TextInputWithLabel}
        width="100%"
      />

      <Field
        name="trust-level-to-complete"
        label="Trust level to complete"
        type="number"
        component={TextInputWithLabel}
        width="100%"
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

function mapPropsToValues(props: UpdateDistributedTask): UpdateDistributedTask {
  return {
    name: props.name,
    description: props.description,
    priority: props.priority,
    'trust-level-to-complete': props['trust-level-to-complete'],
  };
}

function getErrorObject(
  response: UpdateDistributedTaskResponse,
): Dictionary<string> {
  const errorObject: Dictionary<string> = {};

  for (const [, value] of Object.entries(response.Errors)) {
    errorObject[value.title] = value.detail;
  }

  return errorObject;
}

function buildFormData(values: UpdateDistributedTask): FormData {
  const formData = new FormData();

  formData.append('name', values.name);
  formData.append('description', values.description);
  formData.append('priority', values.priority.toString());
  formData.append(
    'trust-level-to-complete',
    values['trust-level-to-complete'].toString(),
  );

  return formData;
}

async function handleSubmitHandler(
  values: UpdateDistributedTask,
  { setSubmitting, setErrors }: FormikActions<UpdateDistributedTask>,
) {
  setSubmitting(true);

  const formData = buildFormData(values);

  const response = await fetch(urlToFetch, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    const responseBody: UpdateDistributedTaskResponse = await response.json();

    const errorObject = getErrorObject(responseBody);

    setErrors(errorObject);
  } else {
    alert('Distributed Task updated');
  }
  setSubmitting(false);
}

const withFormikProps: WithFormikConfig<
  UpdateDistributedTask,
  UpdateDistributedTask
> = {
  handleSubmit: handleSubmitHandler,
  mapPropsToValues,
  validationSchema,
};

const FormWithWarn = withWarnOnUnsavedData(UpdateDistributedTaskForm);
const UpdateDistributedTaskWithFormik = withFormik(withFormikProps)(
  FormWithWarn,
);

export default UpdateDistributedTaskWithFormik;
