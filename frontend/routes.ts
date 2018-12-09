import Routes from 'next-routes';

export const routes = new Routes();

routes.add(
  'distributed-task-definition-details',
  '/distributed-task-definitions/:id',
  'distributed-task-definitions/details',
);
