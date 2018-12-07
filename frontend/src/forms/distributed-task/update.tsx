import { Button, Pane } from 'evergreen-ui';
import {
  Field,
  FormikActions,
  FormikProps,
  withFormik,
  WithFormikConfig,
} from 'formik';
import Kitsu, { JsonApiResponse } from 'kitsu';
import { Dictionary } from 'lodash';
import React, { StatelessComponent } from 'react';
import { ClipLoader } from 'react-spinners';
import * as Yup from 'yup';

import { ErrorAlert } from 'components/form/errors/error-alert';
import { TextInputWithLabel } from 'components/form/text-input';
import { Textarea } from 'components/form/textarea';
import { withWarnOnUnsavedData } from 'components/form/with-warn-unsaved-form';

import { config } from 'config';

const kitsu = new Kitsu<UpdateDistributedTaskModel>({
  baseURL: config.serverIp,
  camelCaseTypes: false,
});

export interface UpdateDistributedTaskModel {
  id: number;
  name: string;
  description: string;
  priority: number;
  'trust-level-to-complete': number;
}

const validationSchema = Yup.object<UpdateDistributedTaskModel>().shape({
  id: Yup.number().required(),
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

type UpdateDistributedTaskProps = FormikProps<UpdateDistributedTaskModel> &
  UpdateDistributedTaskModel;

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

function mapPropsToValues(
  props: UpdateDistributedTaskModel,
): UpdateDistributedTaskModel {
  return {
    id: props.id,
    name: props.name,
    description: props.description,
    priority: props.priority,
    'trust-level-to-complete': props['trust-level-to-complete'],
  };
}

function getErrorsDictionary(
  response: JsonApiResponse<UpdateDistributedTaskModel>,
): Dictionary<string | undefined> {
  const errorObject: Dictionary<string | undefined> = {};

  for (const [, value] of Object.entries(response.errors)) {
    if (value.title !== undefined) {
      errorObject[value.title] = value.detail;
    }
  }

  return errorObject;
}

async function handleSubmitHandler(
  values: UpdateDistributedTaskModel,
  {
    setSubmitting,
    setErrors,
    resetForm,
  }: FormikActions<UpdateDistributedTaskModel>,
) {
  setSubmitting(true);

  kitsu
    .patch('distributed-task', values)
    .then(() => {
      alert('Distributed Task updated');
      resetForm();
    })
    .catch((errorsResponse: JsonApiResponse<UpdateDistributedTaskModel>) => {
      const errorsObject = getErrorsDictionary(errorsResponse);
      setErrors(errorsObject);
    });

  setSubmitting(false);
}

const withFormikProps: WithFormikConfig<
  UpdateDistributedTaskModel,
  UpdateDistributedTaskModel
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
