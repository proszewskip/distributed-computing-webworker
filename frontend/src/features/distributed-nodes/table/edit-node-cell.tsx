import { Button, Dialog, minorScale } from 'evergreen-ui';
import React, { PureComponent } from 'react';
import { CellInfo } from 'react-table';

import { UpdateDistributedNodeForm } from '../update';

export interface EditNodeButtonState {
  dialogVisible: boolean;
}

export interface EditNodeButtonProps {
  forceFetchData: () => void;
  cellInfo: CellInfo;
}

export class EditNodeButton extends PureComponent<
  EditNodeButtonProps,
  EditNodeButtonState
> {
  public state = {
    dialogVisible: false,
  };

  public render() {
    const { dialogVisible } = this.state;
    const { cellInfo } = this.props;

    const { original } = cellInfo;

    return (
      <>
        <Button
          iconBefore="edit"
          marginRight={minorScale(2)}
          onClick={this.onEditClick}
        >
          Edit
        </Button>
        <Dialog
          isShown={dialogVisible}
          title="Update Distributed Node"
          onCloseComplete={this.onCloseComplete}
          hasFooter={false}
        >
          {({ close }: any) => (
            <UpdateDistributedNodeForm
              data={original}
              onFormComplete={this.onFormSaved(close)}
            />
          )}
        </Dialog>
      </>
    );
  }

  private onFormSaved = (closeDialog: () => void) => () => {
    closeDialog();
    this.props.forceFetchData();
  };

  private onCloseComplete = () => {
    this.setState({ dialogVisible: false });
  };

  private onEditClick = () => {
    this.setState({ dialogVisible: true });
  };
}
