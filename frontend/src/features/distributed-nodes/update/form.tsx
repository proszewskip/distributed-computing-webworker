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
import { WarnOnUnsavedData } from 'components/form/warn-on-unsaved-data';

import { getErrorsDictionary } from 'utils/forms/get-errors-dictionary';

import {
  UpdateDistributedNodeFormDependencies,
  UpdateDistributedNodeFormProps,
  UpdateDistributedNodeFormState,
  UpdateDistributedNodeModel,
} from './types';
import { validationSchema } from './validation-schema';

import { BaseDependencies } from 'product-specific';

class PureUpdateDistributedTaskForm extends Component<
  UpdateDistributedNodeFormProps,
  UpdateDistributedNodeFormState
> {
  public state: UpdateDistributedNodeFormState = {
    data: {
      id: this.props.data.id,
      'trust-level': this.props.data['trust-level'],
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

  private renderForm: FormikConfig<UpdateDistributedNodeModel>['render'] = ({
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
            name="trust-level"
            label="Trust level"
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
    UpdateDistributedNodeModel
  >['onSubmit'] = async (values, { setSubmitting, setErrors, resetForm }) => {
    const { kitsu, onFormComplete } = this.props;

    setSubmitting(true);

    kitsu
      .patch('distributed-node', values)
      .then(() => {
        toaster.success('Distributed Node updated');
        resetForm(values);
        onFormComplete();
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
    this.props.onFormComplete();
  };
}

const dependenciesExtractor: DependenciesExtractor<
  BaseDependencies,
  UpdateDistributedNodeFormDependencies
> = ({ kitsu }) => ({ kitsu });

export const UpdateDistributedNodeForm = withDependencies(
  dependenciesExtractor,
)(PureUpdateDistributedTaskForm);
