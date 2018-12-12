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

import {
  UpdateDistributedTaskDependencies,
  UpdateDistributedTaskModel,
  UpdateDistributedTaskProps,
  UpdateDistributedTaskState,
} from './types';

import { BaseDependencies } from 'product-specific';
import { ValidationSchema } from './validation-schema';

class PureUpdateDistributedTaskForm extends Component<
  UpdateDistributedTaskProps,
  UpdateDistributedTaskState
> {
  public state: UpdateDistributedTaskState = {
    data: {
      id: this.props.data.id,
      name: this.props.data.name,
      description: this.props.data.description,
      'trust-level-to-complete': this.props.data['trust-level-to-complete'],
      priority: this.props.data.priority,
    },
  };

  private validationSchema = ValidationSchema;

  public render() {
    return (
      <Formik
        initialValues={this.state.data}
        onSubmit={this.handleSubmitHandler}
        render={this.renderForm}
        validationSchema={this.validationSchema}
      />
    );
  }

  private renderForm: FormikConfig<UpdateDistributedTaskModel>['render'] = ({
    values,
    touched,
    errors,
    isSubmitting,
    dirty,
  }) => {
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
        <WarnOnUnsavedData warn={dirty} />
      </Pane>
    );
  };

  private handleSubmitHandler: FormikConfig<
    UpdateDistributedTaskModel
  >['onSubmit'] = async (values, { setSubmitting, setErrors, resetForm }) => {
    setSubmitting(true);

    this.props.kitsu
      .patch('distributed-task', values)
      .then(() => {
        alert('Distributed Task updated');
        resetForm(values);
      })
      .catch((response: JsonApiErrorResponse) => {
        const errorsObject = getErrorsDictionary(response);
        setErrors(errorsObject);
      });

    setSubmitting(false);
  };
}

const dependenciesExtractor: DependenciesExtractor<
  BaseDependencies,
  UpdateDistributedTaskDependencies
> = ({ kitsu }) => ({ kitsu });

export const UpdateDistributedTaskForm = withDependencies(
  dependenciesExtractor,
)(PureUpdateDistributedTaskForm);
