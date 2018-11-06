import { Dictionary } from 'lodash';

export type FileList = File[];

export interface CreateDistributedTaskDefinition {
  name: string;
  description: string;
  MainDll: File | null;
  AdditionalDlls?: FileList;
}

export interface CreateDistributedTaskDefinitionResponse {
  Errors: Dictionary<string>;
}
