import { storiesOf } from '@storybook/react';
import { Button, Pane } from 'evergreen-ui';
import { Field, Form, Formik, FormikActions, FormikConfig } from 'formik';
import 'normalize.css';
import React, { Component } from 'react';
import { ClipLoader } from 'react-spinners';
import * as Yup from 'yup';

import { ErrorAlert } from 'components/form/errors/error-alert';
import { TextInputWithLabel } from 'components/form/text-input';
import { Textarea } from 'components/form/textarea';
import { WarnOnUnsavedData } from 'components/form/warn-on-unsaved-data';

import { MockNextContext } from '../__mocks__/next-context-provider-mock';

const stories = storiesOf('Example form', module);

interface ExampleModel {
  name: string;
  description: string;
}

interface ExampleFormState {
  data: ExampleModel;
}

type OnSubmitCallback = (
  values: ExampleModel,
  formikActions: FormikActions<ExampleModel>,
) => void;

interface ExampleFormProps {
  onSubmit: OnSubmitCallback;
}

export class ExampleForm extends Component<ExampleFormProps, ExampleFormState> {
  public state: ExampleFormState = {
    data: {
      name: '',
      description: '',
    },
  };

  private validationSchema = Yup.object<ExampleModel>().shape({
    name: Yup.string()
      .min(3, 'Must be longer than 3 characters')
      .required('Required'),
    description: Yup.string(),
  });

  public render() {
    return (
      <Formik
        initialValues={this.state.data}
        onSubmit={this.props.onSubmit}
        render={this.renderForm}
        validationSchema={this.validationSchema}
      />
    );
  }

  private renderForm: FormikConfig<ExampleModel>['render'] = ({
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

          <Button type="button" onClick={onCancelClick}>
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            Submit
          </Button>

          <ClipLoader loading={isSubmitting} />
        </Form>
        <MockNextContext>
          <WarnOnUnsavedData warn={dirty} />
        </MockNextContext>
      </Pane>
    );
  };
}

function onCancelClick() {
  alert('Cancel');
}

function failedSubmit(
  _: ExampleModel,
  { setSubmitting, setErrors }: FormikActions<ExampleModel>,
) {
  setSubmitting(true);

  setTimeout(() => {
    alert('Failed to submit form.');

    const errorsDictionary = {
      Title: 'Details',
    };

    setErrors(errorsDictionary as any);

    setSubmitting(false);
  }, 500);
}

function successfulSubmit(
  _: ExampleModel,
  { setSubmitting, resetForm }: FormikActions<ExampleModel>,
) {
  setSubmitting(true);

  setTimeout(() => {
    const emptyForm: ExampleModel = {
      description: '',
      name: '',
    };
    resetForm(emptyForm);

    alert('Distributed task definition added.');

    setSubmitting(false);
  }, 500);
}

stories.add('Failed submit', () => <ExampleForm onSubmit={failedSubmit} />);
stories.add('Successful submit', () => (
  <ExampleForm onSubmit={successfulSubmit} />
));
