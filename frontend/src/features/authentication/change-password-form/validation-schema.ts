import * as Yup from 'yup';

import { ChangePasswordFields } from './types';

export const validationSchema = Yup.object<ChangePasswordFields>().shape({
  'old-password': Yup.string().required('Required'),
  'new-password': Yup.string()
    .min(6, 'Passwords must be at least 6 characters')
    .test(
      'contains-number',
      "Passwords must have at least one digit ('0'-'9')",
      (newPassword: string) => {
        return /\d/.test(newPassword);
      },
    )
    .test(
      'contains-symbol',
      'Passwords must have at least one non alphanumeric character',
      (newPassword: string) => {
        return /[^a-z^0-9^A-Z]/.test(newPassword);
      },
    )
    .test(
      'contains-uppercase',
      "Passwords must have at least one uppercase ('A'-'Z')",
      (newPassword: string) => {
        return /[A-Z]/.test(newPassword);
      },
    )
    .required('Required'),
  'confirm-new-password': Yup.string()
    .oneOf([Yup.ref('new-password'), null], 'Passwords must match')
    .required('Password confirm is required'),
});
