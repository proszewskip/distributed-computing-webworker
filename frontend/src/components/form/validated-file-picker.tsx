import { FormField, InlineAlert } from 'evergreen-ui';
import React, { PureComponent } from 'react';
import { FilePickerProps } from 'types/file-picker-props';
import { ValidatedFormFieldProps } from 'types/validated-form-field-props';
import FilePicker from './file-picker';

type ValidatedFilePickerProps = FilePickerProps & ValidatedFormFieldProps;

export default class ValidatedFilePicker extends PureComponent<
  ValidatedFilePickerProps
> {
  constructor(props: ValidatedFilePickerProps) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  public render() {
    const { field, form, label, isRequired, ...props } = this.props;
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
        <FilePicker name={name} {...props} onChange={this.onChange} />
      </div>
    );
  }

  private onChange(fileList: FileList) {
    const { form, field } = this.props;

    const { name } = field;

    this.onChange = this.onChange.bind(this);

    form.setFieldValue(name, fileList[0], true);

    const touched = form.touched;
    touched[name] = true;

    form.setTouched(touched);
  }
}
