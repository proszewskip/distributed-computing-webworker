import { withRouter, WithRouterProps } from 'next/router';
import { Component } from 'react';

export interface WarnOnUnsavedDataProps {
  warn: boolean;
  leaveMessage?: string;
}

type WarnOnUnsavedDataPropsWithRouter = WarnOnUnsavedDataProps &
  WithRouterProps;

class WarnOnUnsavedData extends Component<WarnOnUnsavedDataPropsWithRouter> {
  public static defaultProps = {
    leaveMessage: 'You have unsaved changes, are you sure you want to leave?',
  };

  public handleWindowClose = (e: Event) => {
    if (!this.props.warn) {
      return;
    }

    e.preventDefault();
    e.returnValue = false;
  };

  public handleRedirection = () => {
    const { router } = this.props;

    if (!this.props.warn || confirm(this.props.leaveMessage)) {
      return;
    }

    // TODO: Update after route cancellation is added to next router.
    // https://github.com/zeit/next.js/issues/2476
    router.events.off('routeChangeStart', this.handleRedirection);

    router.push(this.props.router.pathname, this.props.router.pathname, {
      shallow: true,
    });

    router.events.on('routeChangeStart', this.handleRedirection);

    throw new Error();
  };

  public componentDidMount = () => {
    window.addEventListener('beforeunload', this.handleWindowClose);

    this.props.router.events.on('routeChangeStart', this.handleRedirection);
  };

  public componentWillUnmount = () => {
    window.removeEventListener('beforeunload', this.handleWindowClose);

    this.props.router.events.off('routeChangeStart', this.handleRedirection);
  };

  public render = () => {
    return null;
  };
}

export const WarnOnUnsavedForm = withRouter<WarnOnUnsavedDataProps>(
  WarnOnUnsavedData,
);
