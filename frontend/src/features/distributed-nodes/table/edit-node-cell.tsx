import { Button, Dialog, minorScale, Pane } from 'evergreen-ui';
import React, { PureComponent } from 'react';
import { CellInfo } from 'react-table';

import { UpdateDistributedNodeForm } from '../update';

import { preventPropagationHandler } from 'utils/table/prevent-propagation-handler';

export interface EditNodeCellState {
  dialogVisible: boolean;
}

export interface EditNodeCellProps {
  forceFetchData: () => void;
  cellInfo: CellInfo;
}

export class EditNodeCell extends PureComponent<
  EditNodeCellProps,
  EditNodeCellState
> {
  public state = {
    dialogVisible: false,
  };

  public render() {
    const { dialogVisible } = this.state;
    const { cellInfo } = this.props;

    const { original } = cellInfo;

    return (
      <Pane onClick={preventPropagationHandler}>
        <Button
          iconBefore="edit"
          marginRight={minorScale(2)}
          onClick={this.onEditClick}
        >
          Edit
        </Button>
        <Dialog
          isShown={dialogVisible}
          title={`Update node ${original.id}`}
          onCloseComplete={this.onCloseComplete}
          hasFooter={false}
        >
          {({ close }: any) => (
            <UpdateDistributedNodeForm
              data={original}
              closeDialog={this.onDialogClose.bind(this, close)}
            />
          )}
        </Dialog>
      </Pane>
    );
  }

  private onDialogClose = (internalDialogClose: any) => {
    internalDialogClose();
    this.props.forceFetchData();
  };

  private onCloseComplete = () => {
    this.setState({ dialogVisible: false });
  };

  private onEditClick = () => {
    this.setState({ dialogVisible: true });
  };
}
