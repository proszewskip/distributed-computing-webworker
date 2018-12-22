import { distanceInWordsToNow } from 'date-fns';
import { Text, Tooltip } from 'evergreen-ui';
import React, { PureComponent } from 'react';

interface UpdatedDateTextProps {
  dateStr: string;
}

interface UpdatedDateTextState {
  updateTimeoutId?: NodeJS.Timeout;
}

class UpdatedDateText extends PureComponent<
  UpdatedDateTextProps,
  UpdatedDateTextState
> {
  public state = {
    updateTimeoutId: undefined,
  };

  public componentDidMount() {
    this.updateTimeout();
  }

  public componentWillUnmount() {
    clearTimeout(this.state.updateTimeoutId);
  }

  public render() {
    if (!this.props) {
      return null;
    }

    const { dateStr } = this.props;

    return <Text>{distanceInWordsToNow(dateStr)}</Text>;
  }

  private getRerenderTimeout = (dateStr: string) => {
    const eventDate = new Date(dateStr).getTime();
    const currentDate = new Date().getTime();

    const datesDifferenceInSeconds = (currentDate - eventDate) / 1000;

    let rerenderDelay = 0;

    if (datesDifferenceInSeconds < 60) {
      rerenderDelay = 10;
    } else if (datesDifferenceInSeconds < 120) {
      rerenderDelay = 30;
    } else if (datesDifferenceInSeconds < 10 * 60) {
      rerenderDelay = 60;
    } else {
      rerenderDelay = 5 * 60;
    }

    return rerenderDelay * 1000;
  };

  private updateTimeout = () => {
    const { dateStr } = this.props;

    const rerenderTimeout = this.getRerenderTimeout(dateStr);

    const updateTimeoutId = setTimeout(() => {
      this.updateTimeout();
    }, rerenderTimeout);

    this.setState({ updateTimeoutId });
  };
}

export const DateCell = (row: { value: any }) => (
  <Tooltip content={new Date(row.value).toLocaleString()}>
    <UpdatedDateText dateStr={row.value} />
  </Tooltip>
);
