import { FieldProps } from 'formik';

interface FormFieldProps {
  label: string;
  isRequired?: boolean;
}

export type ValidatedFormFieldProps = FormFieldProps & FieldProps;
