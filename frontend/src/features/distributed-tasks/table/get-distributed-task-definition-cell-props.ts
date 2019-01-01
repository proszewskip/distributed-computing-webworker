import { LinkCellProps } from 'components/data-table/cells';

import { DistributedTaskWithDefinition } from './types';

export function getDistributedTaskDefinitionCellProps(
  distributedTask: DistributedTaskWithDefinition,
): LinkCellProps {
  const distributedTaskDefinition =
    distributedTask['distributed-task-definition'];

  return {
    route: `/distributed-task-definitions/${distributedTaskDefinition.id}`,
    text: `${distributedTaskDefinition.name}`,
  };
}
