import { Text } from 'evergreen-ui';
import React from 'react';

/**
 * Table cell with a tooltip.
 *
 * @param row
 */
export const LongTextCell = (row: { value: any }) => (
  <Text title={row.value}>{row.value}</Text>
);
