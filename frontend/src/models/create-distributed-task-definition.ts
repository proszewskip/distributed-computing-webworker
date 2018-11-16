import { Dictionary } from 'lodash';

import { ServerError } from './server-error';

export type FileList = File[];

export interface CreateDistributedTaskDefinition {
  name: string;
  description: string;
  MainDll: File | null;
  AdditionalDlls?: FileList;
}

export interface CreateDistributedTaskDefinitionResponse {
  Errors: Dictionary<ServerError>;
}
