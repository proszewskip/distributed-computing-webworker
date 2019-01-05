import React from 'react';
import { FilterRender } from 'react-table';

import { FilterComponentWithTooltip } from './filter-component-with-tooltip';

/**
 * A filter for text fields.
 */
export const TextFilter: FilterRender = (params) => (
  <FilterComponentWithTooltip
    {...params}
    tooltipMessage="For partial match type: 'like:value'"
  />
);
