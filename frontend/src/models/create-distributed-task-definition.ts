export interface CreateDistributedTaskDefinition {
  name: string;
  description: string;
  MainDll: File | undefined;
  AdditionalDlls: FileList | undefined;
}
