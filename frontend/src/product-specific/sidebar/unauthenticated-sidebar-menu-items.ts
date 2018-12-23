import { ConnectedMenuItem } from 'components/sidebar';

export const unauthenticatedSidebarMenuItems: ConnectedMenuItem[] = [
  {
    route: '/',
    title: 'Home',
  },
  {
    route: '/authentication/login',
    title: 'Login',
  },
];
