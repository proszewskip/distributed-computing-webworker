import { ConnectedMenuItem } from 'components/sidebar';

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
    route: '/authentication/login',
    title: 'Login',
  },
];
