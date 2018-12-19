import { identity } from 'ramda';
import * as Yup from 'yup';

import { CreateDistributedTaskModel } from './types';

export const validationSchema = Yup.object<CreateDistributedTaskModel>().shape({
  DistributedTaskDefinitionId: Yup.string().required('required'),
  Name: Yup.string()
    .min(3, 'Must be longer than 2 characters')
    .required('Required'),
  Description: Yup.string(),
  Priority: Yup.number()
    .moreThan(0, 'Priority must be greater than 0')
    .required('Required'),
  TrustLevelToComplete: Yup.number()
    .moreThan(0, 'Trust level to complete must be greater than 0')
    .required('Required'),
  InputData: Yup.mixed().test('Required', 'Required', identity),
});
