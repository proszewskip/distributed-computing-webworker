import * as Yup from 'yup';

import { UpdateDistributedTaskModel } from './types';

export const validationSchema = Yup.object<UpdateDistributedTaskModel>().shape({
  id: Yup.string().required(),
  name: Yup.string()
    .min(3, 'Must be longer than 3 characters')
    .required('Required'),
  description: Yup.string(),
  priority: Yup.number()
    .positive('Priority cannot be less than 0')
    .required('Required'),
  'trust-level-to-complete': Yup.number()
    .moreThan(0, 'Trust level to complete must be greater than 0')
    .required('Required'),
});
