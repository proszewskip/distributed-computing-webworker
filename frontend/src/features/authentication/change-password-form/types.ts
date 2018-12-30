import { WithRouterProps } from 'components/router';
import { Omit } from 'types/omit';

export interface ChangePasswordFields {
  'old-password': string;
  'new-password': string;
  'confirm-new-password': string;
}

export type ChangePasswordBody = Omit<
  ChangePasswordFields,
  'confirm-new-password'
>;

export type PureChangePasswordFormProps = WithRouterProps;

export interface ChangePasswordFormState {
  data: ChangePasswordFields;
}
