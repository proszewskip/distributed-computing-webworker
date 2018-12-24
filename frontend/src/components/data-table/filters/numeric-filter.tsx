import React from 'react';
import { FilterRender } from 'react-table';

import { FilterComponentWithTooltip } from './filter-component-with-tooltip';

export const NumericFilter: FilterRender = (params) => (
  <FilterComponentWithTooltip
    {...params}
    tooltipMessage="For greater than search `gt:value` or `lt:value` for less than."
  />
);
