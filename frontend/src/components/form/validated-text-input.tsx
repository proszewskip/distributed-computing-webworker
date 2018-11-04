import { TextInput } from 'evergreen-ui';
import { FormField, InlineAlert } from 'evergreen-ui';
import React, { PureComponent } from 'react';
import { ValidatedFormFieldProps } from 'types/validated-form-field-props';

export default class ValidatedTextInput extends PureComponent<
  ValidatedFormFieldProps
> {
  public render() {
    const { field, form, label, isRequired } = this.props;
    const { name } = field;
    const { touched, errors } = form;

    return (
      <div>
        <FormField
          labelFor={name}
          label={label}
          isRequired={isRequired}
          {...field}
        />
        {touched[name] &&
          errors[name] && (
            <InlineAlert intent="danger">{errors[name]}</InlineAlert>
          )}
        <TextInput {...field} />
      </div>
    );
  }
}
