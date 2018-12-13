import Routes from 'next-routes';

export const routes = new Routes();

routes.add(
  'create-distributed-task-definition',
  '/distributed-task-definitions/create',
  'distributed-task-definitions/create',
);

routes.add(
  'update-distributed-task-definition',
  '/distributed-task-definitions/:id/update',
  'distributed-task-definitions/update',
);

routes.add(
  'distributed-task-definition-details',
  '/distributed-task-definitions/:id',
  'distributed-task-definitions/details',
);

routes.add(
  'distributed-tasks-details',
  '/distributed-tasks/:id',
  'distributed-tasks/details',
);
