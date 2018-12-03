import { Button, TextInput } from 'evergreen-ui';
import React, { PureComponent } from 'react';
import Box from 'ui-box';

import { FileList } from 'models';

export const CLASS_PREFIX = 'evergreen-file-picker';

interface FilePickerState {
  files: any[];
}

export interface FormFilePickerProps {
  name?: string;
  accept?: string | [string];
  required?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  capture?: boolean;
  height?: number;
  onChange?: (arg: FileList) => any;
}

export default class FormFilePicker extends PureComponent<
  FormFilePickerProps,
  FilePickerState
> {
  public fileInput: any;
  public state: FilePickerState = {
    files: [],
  };

  public render() {
    const {
      name,
      accept,
      required,
      multiple,
      disabled,
      capture,
      height,
      onChange,
      ...props
    } = this.props;
    const { files } = this.state;

    let inputValue;
    if (files.length === 0) {
      inputValue = '';
    } else if (files.length === 1) {
      inputValue = files[0].name;
    } else {
      inputValue = `${files.length} files`;
    }

    let buttonText;
    if (files.length === 0) {
      buttonText = 'Select file';
    } else if (files.length === 1) {
      buttonText = 'Replace file';
    } else {
      buttonText = 'Replace files';
    }

    return (
      <Box display="flex" className={`${CLASS_PREFIX}-root`} {...props}>
        <Box
          innerRef={this.fileInputRef}
          className={`${CLASS_PREFIX}-file-input`}
          is="input"
          type="file"
          name={name}
          accept={accept}
          required={required}
          multiple={multiple}
          disabled={disabled}
          capture={capture}
          onChange={this.handleFileChange}
          display="none"
        />

        <TextInput
          className={`${CLASS_PREFIX}-text-input`}
          readOnly={true}
          value={inputValue}
          placeholder="Select a file to upload…"
          borderTopRightRadius="0 !important"
          borderBottomRightRadius="0 !important"
          height={height}
          flex={1}
          textOverflow="ellipsis"
        />

        <Button
          className={`${CLASS_PREFIX}-button`}
          onClick={this.handleButtonClick}
          disabled={disabled}
          borderTopLeftRadius={0}
          borderBottomLeftRadius={0}
          height={height}
          flexShrink={0}
          type="button"
        >
          {buttonText}
        </Button>
      </Box>
    );
  }

  public fileInputRef = (node: any) => {
    this.fileInput = node;
  };

  public handleFileChange = (e: any) => {
    const { onChange } = this.props;

    const files = [...e.target.files];

    this.setState({ files });

    if (onChange) {
      onChange(files);
    }
  };

  public handleButtonClick = () => {
    this.fileInput.click();
  };
}
