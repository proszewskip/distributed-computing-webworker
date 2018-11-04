export interface FilePickerProps {
  name?: string;
  accept?: string | [string];
  required?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  capture?: boolean;
  height?: number;
  onChange?: (arg: any) => any;
}
