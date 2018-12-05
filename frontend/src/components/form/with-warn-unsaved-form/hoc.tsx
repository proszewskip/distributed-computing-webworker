import { FormikProps } from 'formik';
import React, { Component, ComponentType } from 'react';

import { getDisplayName } from 'utils/get-display-name';

import { withRouter, WithRouterProps } from 'next/router';

type WithWarnOnUnsavedDataRequiredProps = Pick<FormikProps<any>, 'dirty'>;

export function withWarnOnUnsavedData<
  Props extends WithWarnOnUnsavedDataRequiredProps
>(WrappedComponent: ComponentType<Props>) {
  class WithWarnUnsavedForm extends Component<Props & WithRouterProps> {
    public static displayName = `withValidation(${getDisplayName(
      WrappedComponent,
    )})`;

    private leaveMessage: string =
      'You have unsaved changes, are you sure you want to leave?';

    public handleWindowClose = (e: Event) => {
      if (!this.props.dirty) {
        return;
      }

      e.preventDefault();
      e.returnValue = false;
    };

    public handleRedirection = () => {
      if (this.props.dirty && !confirm(this.leaveMessage)) {
        // TODO: Update after route cancellation is added to next router.
        // https://github.com/zeit/next.js/issues/2476
        this.props.router.events.off(
          'routeChangeStart',
          this.handleRedirection,
        );

        this.props.router.push(
          this.props.router.pathname,
          this.props.router.pathname,
          { shallow: true },
        );

        this.props.router.events.on('routeChangeStart', this.handleRedirection);

        throw Error;
      }
    };

    public componentDidMount = () => {
      window.addEventListener('beforeunload', this.handleWindowClose);

      this.props.router.events.on('routeChangeStart', this.handleRedirection);
    };

    public componentWillUnmount = () => {
      window.removeEventListener('beforeunload', this.handleWindowClose);

      this.props.router.events.off('routeChangeStart', this.handleRedirection);
    };

    public render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return withRouter(WithWarnUnsavedForm);
}
