import * as Yup from 'yup';

import { UpdateDistributedNodeModel } from './types';

export const validationSchema = Yup.object<UpdateDistributedNodeModel>().shape({
  id: Yup.string().required(),
  'trust-level': Yup.number()
    .moreThan(0, 'Trust level must be greater than 0')
    .required('Required'),
});
