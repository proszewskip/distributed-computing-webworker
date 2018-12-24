import { WithRouterProps } from 'components/router';

export interface LoginRequestBody {
  username: string;
  password: string;
}

export type PureLoginFormProps = WithRouterProps;

export interface LoginFormState {
  data: LoginRequestBody;
}
