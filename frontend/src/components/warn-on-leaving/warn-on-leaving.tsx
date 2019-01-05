import { Component } from 'react';

import { withRouter, WithRouterProps } from 'components/router';

export interface WarnOnLeavingProps {
  warn: boolean;
  leaveMessage?: string;
}

type WarnOnLeavingPropsWithRouter = WarnOnLeavingProps & WithRouterProps;

/**
 * A component that warns the user when navigating away from the site.
 *
 * Useful when there are unsaved changes in the form or some process is in progress.
 *
 * Does not render any content.
 */
class PureWarnOnLeaving extends Component<WarnOnLeavingPropsWithRouter> {
  public static defaultProps: Partial<WarnOnLeavingPropsWithRouter> = {
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

export const WarnOnLeaving = withRouter(PureWarnOnLeaving);
