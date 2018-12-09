import { Alert, Button, Pane } from 'evergreen-ui';
import { Field, Form, Formik, FormikConfig } from 'formik';
import { JsonApiErrorResponse } from 'kitsu';
import React, { Component } from 'react';
import { ClipLoader } from 'react-spinners';
import * as Yup from 'yup';

import {
  DependenciesExtractor,
  withDependencies,
} from 'components/dependency-injection/with-dependencies';
import { ErrorAlert } from 'components/form/errors/error-alert';
import { TextInputWithLabel } from 'components/form/text-input';
import { Textarea } from 'components/form/textarea';
import { WarnOnUnsavedForm } from 'components/form/warn-on-unsaved-form';

import { getErrorsDictionary } from 'utils/get-errors-dictionary';

import { BaseDependencies } from 'product-specific';

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

interface UpdateDistributedTaskDefinitionDependencies {
  kitsu: BaseDependencies['kitsu'];
}

interface UpdateDistributedTaskDefinitionProps
  extends UpdateDistributedTaskDefinitionDependencies {
  id: number;
}

class UpdateDistributedTaskDefinitionFormWithoutDependencies extends Component<
  UpdateDistributedTaskDefinitionProps,
  UpdateDistributedTaskDefinitionState
> {
  public state: UpdateDistributedTaskDefinitionState = {
    data: {
      name: '',
      description: '',
      id: this.props.id,
    },
    fetchError: false,
    fetchFinished: false,
  };

  private validationSchema = Yup.object<
    UpdateDistributedTaskDefinitionModel
  >().shape({
    id: Yup.number().required(),
    name: Yup.string()
      .min(3, 'Must be longer than 3 characters')
      .required('Required'),
    description: Yup.string(),
  });

  public componentDidMount = () => {
    this.props.kitsu
      .get<UpdateDistributedTaskDefinitionModel>(
        `distributed-task-definitions/${this.props.id}`,
      )
      .then((jsonApiResponse) => {
        const model: UpdateDistributedTaskDefinitionModel = {
          description: jsonApiResponse.data.description,
          id: jsonApiResponse.data.id,
          name: jsonApiResponse.data.name,
        };

        return model;
      })
      .then((model) => this.setState({ data: model, fetchFinished: true }))
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
        />
      )
    );
  }

  private renderForm: FormikConfig<
    UpdateDistributedTaskDefinitionModel
  >['render'] = ({ values, touched, errors, isSubmitting, dirty }) => {
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
        <WarnOnUnsavedForm warn={dirty} />
      </Pane>
    );
  };

  private handleSubmitHandler: FormikConfig<
    UpdateDistributedTaskDefinitionModel
  >['onSubmit'] = async (values, { setSubmitting, setErrors, resetForm }) => {
    setSubmitting(true);

    this.props.kitsu
      .patch('distributed-task-definition', values)
      .then(() => {
        alert('Distributed Task Definition updated');
        resetForm(values);
      })
      .catch(
        (
          errorsResponse: JsonApiErrorResponse<
            UpdateDistributedTaskDefinitionModel
          >,
        ) => {
          const errorsDictionary = getErrorsDictionary(errorsResponse);
          setErrors(errorsDictionary);
        },
      );

    setSubmitting(false);
  };
}

const dependenciesExtractor: DependenciesExtractor<
  BaseDependencies,
  UpdateDistributedTaskDefinitionDependencies
> = ({ kitsu }) => ({ kitsu });

export const UpdateDistributedTaskDefinitionForm = withDependencies(
  dependenciesExtractor,
)(UpdateDistributedTaskDefinitionFormWithoutDependencies);
