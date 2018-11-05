import { Dictionary } from 'lodash';

export interface CreateDistributedTaskDefinition {
  name: string;
  description: string;
  MainDll: File | undefined;
  AdditionalDlls: FileList | undefined;
}

export interface CreateDistributedTaskDefinitionResponse {
  Errors: Dictionary<string>;
}
