import { Button, Pane } from 'evergreen-ui';
import { Field, Form, Formik, FormikConfig } from 'formik';
import { JsonApiErrorResponse } from 'kitsu';
import React, { Component } from 'react';
import { ClipLoader } from 'react-spinners';

import {
  DependenciesExtractor,
  withDependencies,
} from 'components/dependency-injection/with-dependencies';
import { ErrorAlert } from 'components/form/errors/error-alert';
import { TextInputWithLabel } from 'components/form/text-input';
import { Textarea } from 'components/form/textarea';
import { WarnOnUnsavedData } from 'components/form/warn-on-unsaved-data';

import { getErrorsDictionary } from 'utils/forms/get-errors-dictionary';

import { BaseDependencies } from 'product-specific';

import {
  UpdateDistributedTaskDefinitionDependencies,
  UpdateDistributedTaskDefinitionModel,
  UpdateDistributedTaskDefinitionProps,
  UpdateDistributedTaskDefinitionState,
} from './types';
import { validationSchema } from './validation-schema';

class PureUpdateDistributedTaskDefinitionForm extends Component<
  UpdateDistributedTaskDefinitionProps,
  UpdateDistributedTaskDefinitionState
> {
  public state: UpdateDistributedTaskDefinitionState = {
    data: {
      name: this.props.data.name,
      description: this.props.data.description,
      id: this.props.data.id,
    },
  };

  public render() {
    return (
      <Formik
        initialValues={this.state.data}
        onSubmit={this.handleSubmitHandler}
        render={this.renderForm}
        validationSchema={validationSchema}
      />
    );
  }

  private renderForm: FormikConfig<
    UpdateDistributedTaskDefinitionModel
  >['render'] = ({ values, touched, errors, isSubmitting, dirty }) => {
    return (
      <Pane maxWidth={600}>
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
        <WarnOnUnsavedData warn={dirty} />
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
      .catch((errorsResponse: JsonApiErrorResponse) => {
        const errorsDictionary = getErrorsDictionary(errorsResponse);
        setErrors(errorsDictionary);
      });

    setSubmitting(false);
  };
}

const dependenciesExtractor: DependenciesExtractor<
  BaseDependencies,
  UpdateDistributedTaskDefinitionDependencies
> = ({ kitsu }) => ({ kitsu });

export const UpdateDistributedTaskDefinitionForm = withDependencies(
  dependenciesExtractor,
)(PureUpdateDistributedTaskDefinitionForm);
