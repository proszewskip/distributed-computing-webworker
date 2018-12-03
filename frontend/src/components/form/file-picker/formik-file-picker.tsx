import { FieldProps } from 'formik';
import React, { PureComponent } from 'react';

import { withLabel } from '../with-label';
import { withValidation } from '../with-validation';
import FormFilePicker, { FormFilePickerProps } from './form-file-picker';

import { FileList } from 'models';

export type BaseFilePickerProps = FormFilePickerProps & FieldProps;

export class BaseFilePicker extends PureComponent<BaseFilePickerProps> {
  public render() {
    const { field, form, ...props } = this.props;
    const { name } = field;

    return <FormFilePicker name={name} {...props} onChange={this.onChange} />;
  }

  private onChange: FormFilePickerProps['onChange'] = (fileArray: FileList) => {
    const { form, field, multiple } = this.props;

    const { name } = field;

    if (!multiple) {
      form.setFieldValue(name, fileArray[0] || null, true);
    } else {
      form.setFieldValue(name, fileArray, true);
    }

    const touched = {
      ...form.touched,
      [name]: true,
    };

    form.validateForm();
    form.setTouched(touched);
  };
}

export const FilePicker = withValidation(BaseFilePicker);
export const FilePickerWithLabel = withLabel(FilePicker);
