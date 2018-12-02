import Router from 'next/router';
import React, { Component, ComponentType } from 'react';

import { getDisplayName } from 'utils/get-display-name';

interface WithWarnProps {
  dirty: boolean;
}

export function withWarnUnsavedData<Props extends WithWarnProps>(
  WrappedComponent: ComponentType<Props>,
) {
  class WithWarnUnsavedForm extends Component<Props> {
    public static displayName = `withValidation(${getDisplayName(
      WrappedComponent,
    )})`;

    private leaveMessage: string =
      'You have unsaved changes, are you sure you want to leave?';

    public handleWindowClose = (e: Event) => {
      if (this.props.dirty) {
        e.preventDefault();
        return (e.returnValue = false);
      }
    };

    public handleRedirection = () => {
      if (this.props.dirty && !confirm(this.leaveMessage)) {
        throw Error;
      }
    };

    public componentDidMount = () => {
      window.addEventListener('beforeunload', this.handleWindowClose);

      if (Router.router) {
        Router.router.events.on('routeChangeStart', this.handleRedirection);
      }
    };

    public componentWillUnmount = () => {
      window.removeEventListener('beforeunload', this.handleWindowClose);

      if (Router.router) {
        Router.router.events.off('routeChangeStart', this.handleRedirection);
      }
    };

    public render() {
      return (
        <>
          <WrappedComponent {...this.props} />
        </>
      );
    }
  }

  return WithWarnUnsavedForm;
}
