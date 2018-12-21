import { ConnectedMenuItem } from 'components/sidebar';

export const authenticatedSidebarMenuItems: ConnectedMenuItem[] = [
  {
    route: '/',
    title: 'Home',
  },
  {
    route: '/distributed-task-definitions',
    title: 'Distributed Task Definitions',
  },
  {
    route: '/distributed-tasks',
    title: 'Distributed Tasks',
  },
  {
    route: '/distributed-nodes',
    title: 'Distributed Nodes',
  },
  {
    route: '/worker-example',
    title: 'Worker',
  },
  {
    route: '/authentication/logout',
    title: 'Logout',
  },
];
