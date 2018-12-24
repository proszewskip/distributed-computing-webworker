import { Text, Tooltip } from 'evergreen-ui';
import React from 'react';

export const LongTextCell = (row: { value: any }) => (
  <Tooltip content={row.value} position="left">
    <Text>{row.value}</Text>
  </Tooltip>
);
