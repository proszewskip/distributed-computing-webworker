import { ConnectedMenuItem } from 'components/sidebar';

import { config } from 'product-specific/config';

export const unauthenticatedSidebarMenuItems: ConnectedMenuItem[] = [
  {
    route: '/',
    title: 'Home',
  },
  {
    route: config.loginPageUrl,
    title: 'Login',
  },
];
