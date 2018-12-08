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

const kitsu = new Kitsu<UpdateDistributedTaskDefinitionModel>({
  baseURL: config.serverIp,
  camelCaseTypes: false,
});

export interface UpdateDistributedTaskDefinitionModel {
  id: number;
  name: string;
  description: string;
}

const validationSchema = Yup.object<
  UpdateDistributedTaskDefinitionModel
>().shape({
  id: Yup.number().required(),
  name: Yup.string()
    .min(3, 'Must be longer than 3 characters')
    .required('Required'),
  description: Yup.string(),
});

type UpdateDistributedTaskDefinitionProps = FormikProps<
  UpdateDistributedTaskDefinitionModel
> &
  UpdateDistributedTaskDefinitionModel;

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
  props: UpdateDistributedTaskDefinitionModel,
): UpdateDistributedTaskDefinitionModel {
  return {
    id: props.id,
    name: props.name,
    description: props.description,
  };
}

function getErrorsDictionary(
  response: JsonApiResponse<UpdateDistributedTaskDefinitionModel>,
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
  values: UpdateDistributedTaskDefinitionModel,
  {
    setSubmitting,
    setErrors,
    resetForm,
  }: FormikActions<UpdateDistributedTaskDefinitionModel>,
) {
  setSubmitting(true);

  kitsu
    .patch('distributed-task-definition', values)
    .then(() => {
      alert('Distributed Task Definition updated');
      resetForm(values);
    })
    .catch(
      (
        errorsResponse: JsonApiResponse<UpdateDistributedTaskDefinitionModel>,
      ) => {
        const errorsObject = getErrorsDictionary(errorsResponse);
        setErrors(errorsObject);
      },
    );

  setSubmitting(false);
}

const withFormikProps: WithFormikConfig<
  UpdateDistributedTaskDefinitionModel,
  UpdateDistributedTaskDefinitionModel
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
