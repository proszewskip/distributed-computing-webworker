import { FileList } from 'models';

export interface CreateDistributedTaskDefinitionModel {
  Name: string;
  Description: string;
  MainDll: File | null;
  AdditionalDlls?: FileList;
}

export interface CreateDistributedTaskDefinitionState {
  data: CreateDistributedTaskDefinitionModel;
}
