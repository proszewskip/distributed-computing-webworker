import FormData from 'form-data';
import { ErrorMessage, Field, Form, Formik, FormikActions } from 'formik';
import fetch from 'isomorphic-unfetch';
import React, { Component } from 'react';
import * as Yup from 'yup';

const serverIp = 'http://localhost:5000';
const entityPath = '/distributed-task-definitions/add';
const urlToFetch = `${serverIp}${entityPath}`;

const SignUpSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Must be longer than 3 characters')
    .required('Required'),
  // 'main-dll': Yup.object().required('Required'),
  // 'additional-dlls': Yup.object().required('Required'),
});

interface DistributedTaskDefinition {
  name: string;
  description: string;
  MainDll: File | undefined;
  'additional-dlls': FileList | undefined;
}

interface FormExampleProps {
  data: DistributedTaskDefinition[];
}

class FormExample extends Component<FormExampleProps> {
  public render() {
    const initialValues: DistributedTaskDefinition = {
      name: '',
      description: '',
      MainDll: undefined,
      AdditionalDlls: undefined,
    };

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={SignUpSchema}
        /* tslint:disable:jsx-no-multiline-js jsx-no-lambda*/

        onSubmit={(
          values: DistributedTaskDefinition,
          {
            setSubmitting,
            setErrors,
            setTouched,
          }: FormikActions<DistributedTaskDefinition>,
        ) => {
          setTimeout(async () => {
            setTouched({
              MainDll: true,
              AdditionalDlls: true,
            });

            setSubmitting(false);
            const data = new FormData();
            data.append('MainDll', values.MainDll);

            if (values['AdditionalDlls'] !== undefined) {
              for (const file of values['AdditionalDlls']) {
                data.append('AdditionalDlls', file);
              }
            }
            data.append('name', values.name);

            await fetch(urlToFetch, {
              method: 'post',
              body: data,
            }).then(async (response: any) => {
              if (!response.ok) {
                const result = await response.json();

                const errorObject = {};

                for (const error of result.Errors) {
                  errorObject[error.title] = error.detail;
                }

                setErrors(errorObject);

                alert(JSON.stringify(errorObject));
              }
            });
          }, 500);
        }}
        render={({ setFieldValue }) => (
          <Form>
            <label htmlFor="name">Name</label>
            <Field
              id="name"
              name="name"
              placeholder="Distributed Task Definition Name"
              type="text"
            />
            <ErrorMessage name="name">
              {(errorMessage) => <div className="error">{errorMessage}</div>}
            </ErrorMessage>

            <label htmlFor="description">Description</label>
            <Field
              id="description"
              name="description"
              placeholder="Distributed Task Definition Description"
              type="text"
            />

            <label htmlFor="main-dll">Main Dll</label>
            <Field
              id="main-dll"
              name="main-dll"
              type="file"
              accept=".dll"
              onChange={(event: any) => {
                setFieldValue('MainDll', event.currentTarget.files[0]);
              }}
            />
            <ErrorMessage name="MainDll">
              {(errorMessage) => <div className="error">{errorMessage}</div>}
            </ErrorMessage>

            <label htmlFor="additional-dlls">Additional Dlls</label>
            <Field
              id="additional-dlls"
              name="additional-dlls"
              type="file"
              multiple={true}
              accept=".dll"
              onChange={(event: any) => {
                setFieldValue('AdditionalDlls', event.currentTarget.files);
              }}
            />

            <ErrorMessage name="AdditionalDlls">
              {(errorMessage) => <div className="error">{errorMessage}</div>}
            </ErrorMessage>

            <button type="submit" style={{ display: 'block' }}>
              Submit
            </button>
          </Form>
        )}
      />
    );
  }
}

export default FormExample;
