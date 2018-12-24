import { ConnectedMenuItem } from 'components/sidebar';

import { config } from 'product-specific/config';

export const unauthenticatedSidebarMenuItems: ConnectedMenuItem[] = [
  {
    route: '/',
    title: 'Home',
  },
  {
    route: '/worker',
    title: 'Worker',
  },
  {
    route: config.loginPageUrl,
    title: 'Login',
  },
];
