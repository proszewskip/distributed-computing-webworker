import { Router } from 'next-routes';
import { withRouter as originalWithRouter } from 'next/router';
import { ComponentType } from 'react';

import { Subtract } from 'types/subtract';

export interface WithRouterProps {
  router: Router;
}

export function withRouter<Props extends WithRouterProps>(
  Component: ComponentType<Props>,
) {
  return (originalWithRouter(Component) as unknown) as ComponentType<
    Subtract<Props, WithRouterProps>
  >;
}
