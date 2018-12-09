import { Alert, Button, Pane } from 'evergreen-ui';
import { Field, Form, Formik, FormikActions, FormikProps } from 'formik';
import Kitsu, { JsonApiResponse } from 'kitsu';
import { Dictionary } from 'lodash';
import React, { Component } from 'react';
import { ClipLoader } from 'react-spinners';
import * as Yup from 'yup';

import { ErrorAlert } from 'components/form/errors/error-alert';
import { TextInputWithLabel } from 'components/form/text-input';
import { Textarea } from 'components/form/textarea';
import { WarnOnUnsavedForm } from 'components/form/with-warn-unsaved-form';

import { config } from 'config';

const kitsu = new Kitsu<UpdateDistributedTaskDefinitionModel>({
  baseURL: config.serverIp,
  camelCaseTypes: false,
});

interface UpdateDistributedTaskDefinitionModel {
  id: number;
  name: string;
  description: string;
}

interface UpdateDistributedTaskDefinitionState {
  fetchFinished: boolean;
  fetchError: boolean;
  data: UpdateDistributedTaskDefinitionModel;
}

interface UpdateDistributedTaskDefinitionProps {
  id: number;
}

export class UpdateDistributedTaskDefinitionForm extends Component<
  UpdateDistributedTaskDefinitionProps,
  UpdateDistributedTaskDefinitionState
> {
  private validationSchema = Yup.object<
    UpdateDistributedTaskDefinitionModel
  >().shape({
    id: Yup.number().required(),
    name: Yup.string()
      .min(3, 'Must be longer than 3 characters')
      .required('Required'),
    description: Yup.string(),
  });

  constructor(props: any) {
    super(props);

    this.state = {
      data: {
        name: '',
        description: '',
        id: props.id,
      },
      fetchError: false,
      fetchFinished: false,
    };
  }

  public componentDidMount = () => {
    kitsu
      .get(`distributed-task-definitions/${this.props.id}`)
      .then((result) => result.data)
      .then((result) => this.setState({ data: result, fetchFinished: true }))
      .catch(() => {
        this.setState({ fetchError: true, fetchFinished: true });
      });
  };

  public render() {
    const { fetchFinished, fetchError } = this.state;

    return (
      (!fetchFinished && <ClipLoader loading={true} />) ||
      (fetchError && (
        <Alert intent="danger" title="Failed to fetch resources" />
      )) || (
        <Formik
          initialValues={this.state.data}
          onSubmit={this.handleSubmitHandler}
          render={this.renderForm}
          validationSchema={this.validationSchema}
        >
          {({ dirty }) => <WarnOnUnsavedForm warn={dirty} />}}
        </Formik>
      )
    );
  }

  private renderForm = ({
    values,
    touched,
    errors,
    isSubmitting,
  }: FormikProps<UpdateDistributedTaskDefinitionModel>) => {
    return (
      <Pane width="30%">
        <Form>
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
        </Form>
      </Pane>
    );
  };

  private getErrorsDictionary = (
    response: JsonApiResponse<UpdateDistributedTaskDefinitionModel>,
  ) => {
    const errorsDictionary: Dictionary<string> = {};

    for (const [, value] of Object.entries(response.errors)) {
      if (value.title !== undefined) {
        errorsDictionary[value.title] = value.detail ? value.detail : '';
      }
    }

    return errorsDictionary;
  };

  private handleSubmitHandler = async (
    values: UpdateDistributedTaskDefinitionModel,
    {
      setSubmitting,
      setErrors,
      resetForm,
    }: FormikActions<UpdateDistributedTaskDefinitionModel>,
  ) => {
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
          const errorsDictionary = this.getErrorsDictionary(errorsResponse);
          setErrors(errorsDictionary);
        },
      );

    setSubmitting(false);
  };
}
