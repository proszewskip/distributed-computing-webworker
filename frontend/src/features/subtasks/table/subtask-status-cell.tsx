import { Alert, Button, Dialog, minorScale, Pane, Text } from 'evergreen-ui';
import React, { PureComponent, ReactNode } from 'react';

import { Subtask, SubtaskStatus } from 'models';

import { preventPropagationHandler } from 'utils/table/prevent-propagation-handler';

export const SubtaskStatusCell = (row: { value: Subtask }) => {
  return <SubtaskStatusCellContent subtask={row.value} />;
};

interface SubtaskStatusCellContentState {
  isShown: boolean;
}

interface SubtaskStatusCellContentProps {
  subtask: Subtask;
}

class SubtaskStatusCellContent extends PureComponent<
  SubtaskStatusCellContentProps,
  SubtaskStatusCellContentState
> {
  public state: SubtaskStatusCellContentState = {
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
        return <Text marginLeft={minorScale(2)}>Done</Text>;
      case SubtaskStatus.Executing:
        return <Text marginLeft={minorScale(2)}>In progress</Text>;
      case SubtaskStatus.Error:
        return (
          <Button
            appearance="minimal"
            intent="danger"
            onClick={this.onStatusClick}
            paddingX={minorScale(2)}
          >
            Error
          </Button>
        );
      case SubtaskStatus.WaitingForExecution:
        return <Text marginLeft={minorScale(2)}>Waiting for execution</Text>;
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
      >
        <Pane>
          {subtask.errors.map((error, index) => (
            <Alert key={index} intent="danger">
              <Text wordBreak="break-all">{error}</Text>
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
