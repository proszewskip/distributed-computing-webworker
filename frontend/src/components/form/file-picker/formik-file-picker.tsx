import React, { PureComponent } from 'react';
import { FilePickerProps } from 'types/file-picker-props';

import { FieldProps } from 'formik';
import FilePicker from './file-picker';

type FormikFilePickerProps = FilePickerProps & FieldProps;

export class FormikFilePicker extends PureComponent<FormikFilePickerProps> {
  constructor(props: FormikFilePickerProps) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  public render() {
    const { field, form, ...props } = this.props;
    const { name } = field;

    return <FilePicker name={name} {...props} onChange={this.onChange} />;
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
