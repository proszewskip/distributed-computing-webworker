import * as Yup from 'yup';

import { UpdateDistributedTaskDefinitionModel } from '.';

export const ValidationSchema = Yup.object<
  UpdateDistributedTaskDefinitionModel
>().shape({
  id: Yup.string().required(),
  name: Yup.string()
    .min(3, 'Must be longer than 3 characters')
    .required('Required'),
  description: Yup.string(),
});
