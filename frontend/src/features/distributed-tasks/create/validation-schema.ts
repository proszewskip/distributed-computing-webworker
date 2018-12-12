import { identity } from 'ramda';
import * as Yup from 'yup';

import { CreateDistributedTaskModel } from '.';

export const ValidationSchema = Yup.object<CreateDistributedTaskModel>().shape({
  DistributedTaskDefinitionId: Yup.number().required('required'),
  Name: Yup.string()
    .min(3, 'Must be longer than 3 characters')
    .required('Required'),
  Description: Yup.string(),
  Priority: Yup.number()
    .positive('Priority cannot be less than 0')
    .required('Required'),
  TrustLevelToComplete: Yup.number()
    .moreThan(0, 'Trust level to complete must be greater than 0')
    .required('Required'),
  InputData: Yup.mixed().test('Required', 'Required', identity),
});
