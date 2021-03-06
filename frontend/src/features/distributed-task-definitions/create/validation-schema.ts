import { identity } from 'ramda';
import * as Yup from 'yup';

import { CreateDistributedTaskDefinitionModel } from './types';

export const validationSchema = Yup.object<
  CreateDistributedTaskDefinitionModel
>().shape({
  Name: Yup.string()
    .min(3, 'Must be longer than 2 characters')
    .required('Required'),
  Description: Yup.string(),
  MainDll: Yup.mixed().test('Required', 'Required', identity),
  AdditionalDlls: Yup.array<File>()
    .min(1, 'Required')
    .required('Required'),
});
