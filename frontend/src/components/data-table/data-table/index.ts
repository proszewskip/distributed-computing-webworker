import { ComponentProps } from 'types/component-props';

export * from './interfaces';
export * from './data-table';

import { DataTable } from './data-table';
export type DataTableProps = ComponentProps<typeof DataTable>;
