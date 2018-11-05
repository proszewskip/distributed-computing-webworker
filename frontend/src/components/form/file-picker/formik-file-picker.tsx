import { FieldProps } from 'formik';
import React, { PureComponent } from 'react';

import { withLabel } from '../with-label';
import { withValidation } from '../with-validation';
import FormFilePicker, { FilePickerProps } from './form-file-picker';

export type FormikFilePickerProps = FilePickerProps & FieldProps;

export class BaseFilePicker extends PureComponent<FormikFilePickerProps> {
  public render() {
    const { field, form, ...props } = this.props;
    const { name } = field;

    return <FormFilePicker name={name} {...props} onChange={this.onChange} />;
  }

  private onChange: FilePickerProps['onChange'] = (fileList: FileList) => {
    const { form, field, multiple } = this.props;

    const { name } = field;

    if (!multiple) {
      form.setFieldValue(name, fileList[0], true);
    } else {
      form.setFieldValue(name, fileList, true);
    }

    const touched = {
      ...form.touched,
      [name]: true,
    };

    form.setTouched(touched);
  };
}

export const FilePicker = withValidation(BaseFilePicker);
export const FilePickerWithLabel = withLabel(FilePicker);
