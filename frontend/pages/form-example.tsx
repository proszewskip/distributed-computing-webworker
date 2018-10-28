import FormData from 'form-data';
import { Field, Form, Formik, FormikActions } from 'formik';
import fetch from 'isomorphic-unfetch';
import React, { Component } from 'react';
const serverIp = 'http://localhost:5000';
const entityPath = '/distributed-task-definitions/add';
const urlToFetch = `${serverIp}${entityPath}`;

interface DistributedTaskDefinition {
  name: string;
  description: string;
  'main-dll': File | null;
  'additional-dlls': FileList | null;
}

interface FormExampleProps {
  data: DistributedTaskDefinition[];
}

class FormExample extends Component<FormExampleProps> {
  public render() {
    const initialValues: DistributedTaskDefinition = {
      name: '',
      description: '',
      'main-dll': null,
      'additional-dlls': null,
    };

    return (
      <Formik
        initialValues={initialValues}
        /* tslint:disable:jsx-no-multiline-js jsx-no-lambda*/

        onSubmit={(
          values: DistributedTaskDefinition,
          { setSubmitting }: FormikActions<DistributedTaskDefinition>,
        ) => {
          setTimeout(async () => {
            setSubmitting(false);
            const data = new FormData();
            data.append('MainDll', values['main-dll']);

            for (const file of values['additional-dlls']) {
              data.append('AdditionalDlls', file);
            }
            data.append('name', values.name);

            await fetch(urlToFetch, {
              method: 'post',
              body: data,
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

            <label htmlFor="description">Description</label>
            <Field
              id="description"
              name="description"
              placeholder="Distributed Task Definition Description"
              type="text"
            />

            <label htmlFor="distributedTaskDefinitionMainDll">Main Dll</label>
            <Field
              id="distributedTaskDefinitionMainDll"
              name="distributedTaskDefinitionMainDll"
              type="file"
              accept=".dll"
              onChange={(event: any) => {
                setFieldValue('main-dll', event.currentTarget.files[0]);
              }}
            />

            <label htmlFor="distributedTaskDefinitionAdditionalDlls">
              Additional Dlls
            </label>
            <Field
              id="distributedTaskDefinitionMainDll"
              name="distributedTaskDefinitionMainDll"
              type="file"
              multiple={true}
              accept=".dll"
              onChange={(event: any) => {
                setFieldValue('additional-dlls', event.currentTarget.files);
              }}
            />

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
