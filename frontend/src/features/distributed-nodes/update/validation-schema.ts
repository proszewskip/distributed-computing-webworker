import * as Yup from 'yup';

import { UpdateDistributedNodeModel } from './types';

export const validationSchema = Yup.object<UpdateDistributedNodeModel>().shape({
  id: Yup.string().required(),
  'trust-level': Yup.number()
    .positive('Priority cannot be less than 0')
    .required('Required'),
});
