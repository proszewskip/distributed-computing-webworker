import { TextInput } from 'evergreen-ui';
import { FieldProps } from 'formik';
import React, { PureComponent } from 'react';

export default class FormikTextInput extends PureComponent<FieldProps> {
  public render() {
    const { field } = this.props;

    return (
      <div>
        <TextInput {...field} />
      </div>
    );
  }
}
