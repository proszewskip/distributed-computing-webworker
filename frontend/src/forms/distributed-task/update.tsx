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
import { WarnOnUnsavedData } from 'components/form/warn-on-unsaved-data';

import { getErrorsDictionary } from 'utils/get-errors-dictionary';

import { BaseDependencies } from 'product-specific';

export interface UpdateDistributedTaskModel {
  id: number;
  name: string;
  description: string;
  priority: number;
  'trust-level-to-complete': number;
}

interface UpdateDistributedTaskDependencies {
  kitsu: BaseDependencies['kitsu'];
}

interface UpdateDistributedTaskOwnProps {
  id: number;
}

type UpdateDistributedTaskProps = UpdateDistributedTaskOwnProps &
  UpdateDistributedTaskDependencies;

interface UpdateDistributedTaskState {
  fetchFinished: boolean;
  fetchError: boolean;
  data: UpdateDistributedTaskModel;
}

class PureUpdateDistributedTaskForm extends Component<
  UpdateDistributedTaskProps,
  UpdateDistributedTaskState
> {
  public state: UpdateDistributedTaskState = {
    data: {
      id: this.props.id,
      name: '',
      description: '',
      'trust-level-to-complete': NaN,
      priority: NaN,
    },
    fetchError: false,
    fetchFinished: false,
  };

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

  public getInitialProps = () => {
    this.props.kitsu
      .get<UpdateDistributedTaskModel>(`distributed-task/${this.props.id}`)
      .then((jsonApiResponse) => {
        const model: UpdateDistributedTaskModel = {
          'trust-level-to-complete':
            jsonApiResponse.data['trust-level-to-complete'],
          description: jsonApiResponse.data.description,
          id: jsonApiResponse.data.id,
          name: jsonApiResponse.data.name,
          priority: jsonApiResponse.data.priority,
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
      .catch((response: JsonApiErrorResponse<UpdateDistributedTaskModel>) => {
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
