import { Alert, Button, Dialog, Pane, Text } from 'evergreen-ui';
import React, { Component, ReactNode } from 'react';

import { Subtask, SubtaskStatus } from 'models';

import { preventPropagationHandler } from 'utils/table/prevent-propagation-handler';

export const SubtaskStatusCell = (row: { value: Subtask }) => {
  return <SubtaskStatusCellContent subtask={row.value} />;
};

interface ErrorsDialogState {
  isShown: boolean;
}

interface ErrorsDialogProps {
  subtask: Subtask;
}

class SubtaskStatusCellContent extends Component<
  ErrorsDialogProps,
  ErrorsDialogState
> {
  public state: ErrorsDialogState = {
    isShown: false,
  };

  public render() {
    return (
      <>
        {this.renderStatus()}
        {this.renderDialog()}
      </>
    );
  }

  private getStatusMapping = (subtaskStatus: SubtaskStatus): ReactNode => {
    switch (subtaskStatus) {
      case SubtaskStatus.Done:
        return <Text>Done</Text>;
      case SubtaskStatus.Executing:
        return <Text>In progress</Text>;
      case SubtaskStatus.Error:
        return (
          <Button intent="danger" onClick={this.onStatusClick}>
            Error
          </Button>
        );
      case SubtaskStatus.WaitingForExecution:
        return <Text>Waiting for execution</Text>;
    }
  };

  private renderStatus = () => {
    const { subtask } = this.props;

    return <Pane>{this.getStatusMapping(subtask['subtask-status'])}</Pane>;
  };

  private renderDialog = () => {
    const { isShown } = this.state;
    const { subtask } = this.props;

    return (
      <Dialog
        isShown={isShown}
        title="Subtask errors"
        onCloseComplete={this.onCloseComplete}
        hasFooter={false}
        white-space="normal"
      >
        <Pane>
          {subtask.errors.map((error, index) => (
            <Alert key={index} intent="danger">
              <Text>{error}</Text>
            </Alert>
          ))}
        </Pane>
      </Dialog>
    );
  };

  private onCloseComplete = () => {
    this.setState({ isShown: false });
  };

  private onStatusClick = (event: any) => {
    preventPropagationHandler(event);

    this.setState({ isShown: true });
  };
}
