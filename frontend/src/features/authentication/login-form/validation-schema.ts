import * as Yup from 'yup';

import { LoginRequestBody } from './types';

export const validationSchema = Yup.object<LoginRequestBody>().shape({
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});
