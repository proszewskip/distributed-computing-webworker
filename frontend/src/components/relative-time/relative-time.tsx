import { distanceInWordsToNow } from 'date-fns';
import { Text } from 'evergreen-ui';
import React, { PureComponent } from 'react';

import { getRerenderTimeout } from './get-rerender-timeout';

export interface RelativeTimeProps {
  eventDate: Date;
}

interface RelativeTimeState {
  updateTimeoutId?: number;
}

/**
 * A component that displays relative time and updates once in a while so that the relative time
 * does not become outdated.
 */
export class RelativeTime extends PureComponent<
  RelativeTimeProps,
  RelativeTimeState
> {
  public state: RelativeTimeState = {
    updateTimeoutId: undefined,
  };

  public componentDidMount() {
    this.updateTimeout();
  }

  public componentDidUpdate(prevProps: RelativeTimeProps) {
    if (prevProps.eventDate !== this.props.eventDate) {
      window.clearTimeout(this.state.updateTimeoutId);
      this.updateTimeout();
    }
  }

  public componentWillUnmount() {
    window.clearTimeout(this.state.updateTimeoutId);
  }

  public render() {
    const { eventDate } = this.props;

    return <Text>{distanceInWordsToNow(eventDate, { addSuffix: true })}</Text>;
  }

  private updateTimeout = () => {
    const { eventDate } = this.props;

    const currentDate = new Date();

    const rerenderTimeout = getRerenderTimeout(eventDate, currentDate);

    /**
     * NOTE: use `window.setTimeout` because `@types/node` overrides the type of `setTimeout` and
     * uses a return type that is incompatible with the browser.
     */
    const updateTimeoutId = (setTimeout as typeof window.setTimeout)(
      this.updateTimeout,
      rerenderTimeout,
    );

    this.setState({ updateTimeoutId });
  };
}
