import { Text } from 'evergreen-ui';
import React from 'react';

export const LongTextCell = (row: { value: any }) => (
  <Text title={row.value}>{row.value}</Text>
);
