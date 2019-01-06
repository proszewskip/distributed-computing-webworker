import {
  Card,
  Heading,
  IconButton,
  majorScale,
  Pane,
  Paragraph,
  Text,
} from 'evergreen-ui';
import React, { PureComponent } from 'react';

export interface UsedThreadsCardProps {
  threadsCount: number;
  onChange: (newThreadsCount: number) => void;
}

export class UsedThreadsCard extends PureComponent<UsedThreadsCardProps> {
  public render() {
    const { threadsCount } = this.props;
    const decrementDisabled = threadsCount <= 1;

    return (
      <Card border="default" padding={majorScale(2)}>
        <Heading>Used threads</Heading>

        <Pane
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginBottom={majorScale(1)}
        >
          <IconButton
            icon="minus"
            onClick={this.onDecrement}
            marginX={majorScale(1)}
            disabled={decrementDisabled}
            title="Decrement used threads"
          >
            -
          </IconButton>

          <Text>{threadsCount}</Text>

          <IconButton
            icon="plus"
            onClick={this.onIncrement}
            marginX={majorScale(1)}
            title="Increment used threads"
          >
            +
          </IconButton>
        </Pane>

        <Paragraph>
          Here you can configure how many tasks could be computed
          simultaneously.
        </Paragraph>
      </Card>
    );
  }

  private onIncrement = () => {
    const { threadsCount, onChange } = this.props;

    onChange(threadsCount + 1);
  };

  private onDecrement = () => {
    const { threadsCount, onChange } = this.props;

    onChange(threadsCount - 1);
  };
}
