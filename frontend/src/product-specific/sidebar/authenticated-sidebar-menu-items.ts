import { ConnectedMenuItem } from 'components/sidebar';

export const authenticatedSidebarMenuItems: ConnectedMenuItem[] = [
  {
    route: '/',
    title: 'Home',
  },
  {
    route: '/form-example',
    title: 'Form example',
  },
  {
    route: '/table-example',
    title: 'Table example',
  },
  {
    route: '/distributed-task-definitions',
    title: 'Distributed Task Definitions',
  },
  {
    route: '/distributed-nodes',
    title: 'Distributed Nodes',
  },
];
