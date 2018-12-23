import { distanceInWordsToNow } from 'date-fns';
import { Text } from 'evergreen-ui';
import React, { PureComponent } from 'react';

import { getRerenderTimeoutFnType } from './get-rerender-timeout';

export interface UpdatedDateTextProps {
  dateString: string;
  getRerenderTimeout: getRerenderTimeoutFnType;
}

interface UpdatedDateTextState {
  updateTimeoutId?: number;
}

export class RelativeTime extends PureComponent<
  UpdatedDateTextProps,
  UpdatedDateTextState
> {
  public state: UpdatedDateTextState = {
    updateTimeoutId: undefined,
  };

  public componentDidMount() {
    this.updateTimeout();
  }

  public componentDidUpdate(prevProps: UpdatedDateTextProps) {
    if (prevProps.dateString !== this.props.dateString) {
      this.updateTimeout();
    }
  }

  public componentWillUnmount() {
    window.clearTimeout(this.state.updateTimeoutId);
  }

  public render() {
    const { dateString } = this.props;

    return <Text>{distanceInWordsToNow(dateString)}</Text>;
  }

  private updateTimeout = () => {
    const { dateString, getRerenderTimeout } = this.props;

    const eventDate = new Date(dateString);

    const rerenderTimeout = getRerenderTimeout(eventDate);

    /**
     * NOTE: use `window.setTimeout` becuase `@types/node` override the type of `setTimeout`
     * and use a return type that is incompatible with the browser.
     */
    const updateTimeoutId = window.setTimeout(() => {
      this.updateTimeout();
    }, rerenderTimeout);

    this.setState({ updateTimeoutId });
  };
}
