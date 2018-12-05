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
import { FilePickerWithLabel } from 'components/form/file-picker';
import { TextInputWithLabel } from 'components/form/text-input';
import { Textarea } from 'components/form/textarea';
import { withWarnUnsavedData } from 'components/form/with-warn-unsaved-form';

import { config } from 'config';

import { ServerError } from 'models';

const urlToFetch = `${config.serverIp}/distributed-tasks/add`;

interface CreateDistributedTask {
  name: string;
  description: string;
  priority: number;
  'trust-level-to-complete': number;
  InputData: File | null;
}

const validationSchema = Yup.object<CreateDistributedTask>().shape({
  name: Yup.string()
    .min(3, 'Must be longer than 3 characters')
    .required('Required'),
  description: Yup.string(),
  priority: Yup.number()
    .min(0)
    .required(),
  'trust-level-to-complete': Yup.number()
    .min(0)
    .required(),
  InputData: Yup.mixed().test('Required', 'Required', (value) => {
    return value;
  }),
});

type CreateDistributedTaskProps = FormikProps<CreateDistributedTask> &
  CreateDistributedTask;

interface CreateDistributedTaskResponse {
  Errors: Dictionary<ServerError>;
}

const CreateDistributedTaskForm: StatelessComponent<
  CreateDistributedTaskProps
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
        component={TextInputWithLabel}
        width="100%"
      />

      <Field
        name="trust-level-to-complete"
        label="Trust level to complete"
        component={TextInputWithLabel}
        width="100%"
      />

      <Field
        name="InputData"
        label="Task input"
        component={FilePickerWithLabel}
        accept=".dll"
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

function mapPropsToValues(props: CreateDistributedTask): CreateDistributedTask {
  return {
    name: props.name,
    description: props.description,
    priority: props.priority,
    'trust-level-to-complete': props['trust-level-to-complete'],
    InputData: props.InputData,
  };
}

function getErrorObject(
  response: CreateDistributedTaskResponse,
): Dictionary<string> {
  const errorObject: Dictionary<string> = {};

  for (const [, value] of Object.entries(response.Errors)) {
    errorObject[value.title] = value.detail;
  }

  return errorObject;
}

function buildFormData(values: CreateDistributedTask): FormData {
  const formData = new FormData();

  formData.append('name', values.name);
  formData.append('description', values.description);
  formData.append('priority', values.priority.toString());
  formData.append(
    'trust-level-to-complete',
    values['trust-level-to-complete'].toString(),
  );

  if (values.InputData) {
    formData.append('InputData', values.InputData);
  }

  return formData;
}

async function handleSubmitHandler(
  values: CreateDistributedTask,
  { setSubmitting, setErrors }: FormikActions<CreateDistributedTask>,
) {
  setSubmitting(true);

  const formData = buildFormData(values);

  const response = await fetch(urlToFetch, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const responseBody: CreateDistributedTaskResponse = await response.json();

    const errorObject = getErrorObject(responseBody);

    setErrors(errorObject);
  } else {
    alert('Distributed Task added');
  }
  setSubmitting(false);
}

const withFormikProps: WithFormikConfig<
  CreateDistributedTask,
  CreateDistributedTask
> = {
  handleSubmit: handleSubmitHandler,
  mapPropsToValues,
  validationSchema,
};

const FormWithWarn = withWarnUnsavedData(CreateDistributedTaskForm);
const CreateDistributedTaskWithFormik = withFormik(withFormikProps)(
  FormWithWarn,
);

export default CreateDistributedTaskWithFormik;
