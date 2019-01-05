import React from 'react';
import { FilterRender } from 'react-table';

import { FilterComponentWithTooltip } from './filter-component-with-tooltip';

/**
 * A filter for numeric values.
 *
 * Allows for filtering _lesser than_ or _greater than_ values.
 */
export const NumericFilter: FilterRender = (params) => (
  <FilterComponentWithTooltip
    {...params}
    tooltipMessage="For greater than search 'gt:value' or 'lt:value' for less than."
    isFilterInvalid={isNumericFilterInvalid}
  />
);

const isNumericFilterInvalid = (value: string) => !isNumericFilterValid(value);

export const isNumericFilterValid = (value: string) => {
  if (value.search('gt:') === 0 || value.search('lt:') === 0) {
    value = value.substring(3);
  }

  const parsedNumber = Number(value);

  return !Number.isNaN(parsedNumber);
};
