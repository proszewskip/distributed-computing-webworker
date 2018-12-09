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

interface UpdateDistributedTaskProps {
  id: number;
}

interface UpdateDistributedTaskState {
  fetchFinished: boolean;
  fetchError: boolean;
  data: UpdateDistributedTaskModel;
}

export class UpdateDistributedTaskForm extends Component<
  UpdateDistributedTaskProps,
  UpdateDistributedTaskState
> {
  private validationSchema = Yup.object<UpdateDistributedTaskModel>().shape({
    id: Yup.number().required(),
    name: Yup.string()
      .min(3, 'Must be longer than 3 characters')
      .required('Required'),
    description: Yup.string(),
    priority: Yup.number()
      .positive('Priority cannot be less than 0')
      .required('Required'),
    'trust-level-to-complete': Yup.number()
      .moreThan(0, 'Trust level to complete must be greater than 0')
      .required('Required'),
  });

  constructor(props: UpdateDistributedTaskProps) {
    super(props);

    this.state = {
      data: {
        id: props.id,
        name: '',
        description: '',
        'trust-level-to-complete': NaN,
        priority: NaN,
      },
      fetchError: false,
      fetchFinished: false,
    };
  }

  public componentDidMount = () => {
    kitsu
      .get(`distributed-task/${this.props.id}`)
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
  }: FormikProps<UpdateDistributedTaskModel>) => {
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
        </Form>
      </Pane>
    );
  };

  private getErrorsDictionary = (
    response: JsonApiResponse<UpdateDistributedTaskModel>,
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
    values: UpdateDistributedTaskModel,
    {
      setSubmitting,
      setErrors,
      resetForm,
    }: FormikActions<UpdateDistributedTaskModel>,
  ) => {
    setSubmitting(true);

    kitsu
      .patch('distributed-task', values)
      .then(() => {
        alert('Distributed Task updated');
        resetForm(values);
      })
      .catch((response: JsonApiResponse<UpdateDistributedTaskModel>) => {
        const errorsObject = this.getErrorsDictionary(response);
        setErrors(errorsObject);
      });

    setSubmitting(false);
  };
}
