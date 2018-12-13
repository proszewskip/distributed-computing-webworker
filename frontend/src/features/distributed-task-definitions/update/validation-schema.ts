import * as Yup from 'yup';

import { UpdateDistributedTaskDefinitionModel } from './types';

export const validationSchema = Yup.object<
  UpdateDistributedTaskDefinitionModel
>().shape({
  id: Yup.string().required(),
  name: Yup.string()
    .min(3, 'Must be longer than 3 characters')
    .required('Required'),
  description: Yup.string(),
});
