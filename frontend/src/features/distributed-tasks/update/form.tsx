import { Pane, toaster } from 'evergreen-ui';
import { Field, Form, Formik, FormikConfig } from 'formik';
import { JsonApiErrorResponse } from 'kitsu';
import React, { Component } from 'react';
import { ClipLoader } from 'react-spinners';

import {
  DependenciesExtractor,
  withDependencies,
} from 'components/dependency-injection/with-dependencies';
import { ErrorAlert } from 'components/form/errors/error-alert';
import { FormButtons } from 'components/form/form-buttons';
import { TextInputWithLabel } from 'components/form/text-input';
import { Textarea } from 'components/form/textarea';
import { WarnOnUnsavedData } from 'components/form/warn-on-unsaved-data';

import { withRouter } from 'components/router';

import { getErrorsDictionary } from 'utils/forms/get-errors-dictionary';

import {
  UpdateDistributedTaskDependencies,
  UpdateDistributedTaskModel,
  UpdateDistributedTaskProps,
  UpdateDistributedTaskState,
} from './types';

import { BaseDependencies } from 'product-specific';
import { validationSchema } from './validation-schema';

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

          <FormButtons
            isSubmitting={isSubmitting}
            onCancelClick={this.onCancelClick}
          />

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

    const { kitsu, router } = this.props;

    kitsu
      .patch('distributed-task', values)
      .then(() => {
        toaster.success('Distributed Task updated');
        resetForm();
        router.pushRoute(`/distributed-tasks/${values.id}`);
      })
      .catch((response: JsonApiErrorResponse) => {
        const errorsObject = getErrorsDictionary(response);
        setErrors(errorsObject);
      })
      .then(() => {
        setSubmitting(false);
      });
  };

  private onCancelClick = () => {
    const { router } = this.props;
    const { data } = this.state;

    router.pushRoute(`/distributed-tasks/${data.id}`);
  };
}

const dependenciesExtractor: DependenciesExtractor<
  BaseDependencies,
  UpdateDistributedTaskDependencies
> = ({ kitsu }) => ({ kitsu });

export const UpdateDistributedTaskForm = withRouter(
  withDependencies(dependenciesExtractor)(PureUpdateDistributedTaskForm),
);
