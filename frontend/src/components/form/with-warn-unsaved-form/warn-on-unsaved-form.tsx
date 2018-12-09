import { withRouter, WithRouterProps } from 'next/router';
import { Component } from 'react';

interface WarnOnUnsavedDataProps {
  warn: boolean;
}

type WarnOnUnsavedDataPropsWithRouter = WarnOnUnsavedDataProps &
  WithRouterProps;

class WarnOnUnsavedData extends Component<WarnOnUnsavedDataPropsWithRouter> {
  private leaveMessage: string =
    'You have unsaved changes, are you sure you want to leave?';

  public handleWindowClose = (e: Event) => {
    if (!this.props.warn) {
      return;
    }

    e.preventDefault();
    e.returnValue = false;
  };

  public handleRedirection = () => {
    const { router } = this.props;

    if (!this.props.warn || confirm(this.leaveMessage)) {
      return;
    }

    // TODO: Update after route cancellation is added to next router.
    // https://github.com/zeit/next.js/issues/2476
    router.events.off('routeChangeStart', this.handleRedirection);

    router.push(this.props.router.pathname, this.props.router.pathname, {
      shallow: true,
    });

    router.events.on('routeChangeStart', this.handleRedirection);

    throw Error;
  };

  public componentDidMount = () => {
    window.addEventListener('beforeunload', this.handleWindowClose);

    this.props.router.events.on('routeChangeStart', this.handleRedirection);
  };

  public componentWillUnmount = () => {
    window.removeEventListener('beforeunload', this.handleWindowClose);

    this.props.router.events.off('routeChangeStart', this.handleRedirection);
  };
}

export const WarnOnUnsavedForm = withRouter<WarnOnUnsavedDataProps>(
  WarnOnUnsavedData,
);
