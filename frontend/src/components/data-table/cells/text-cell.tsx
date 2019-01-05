import { Text } from 'evergreen-ui';
import React from 'react';

/**
 * A regular table cell
 *
 * @param row
 */
export const TextCell = (row: { value: any }) => <Text>{row.value}</Text>;
