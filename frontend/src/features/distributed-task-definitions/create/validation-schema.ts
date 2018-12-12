import { identity } from 'ramda';
import * as Yup from 'yup';

import { CreateDistributedTaskDefinitionModel } from '.';

export const ValidationSchema = Yup.object<
  CreateDistributedTaskDefinitionModel
>().shape({
  Name: Yup.string()
    .min(3, 'Must be longer than 3 characters')
    .required('Required'),
  Description: Yup.string(),
  MainDll: Yup.mixed().test('Required', 'Required', identity),
  AdditionalDlls: Yup.array<File>()
    .min(1, 'Required')
    .required('Required'),
});
