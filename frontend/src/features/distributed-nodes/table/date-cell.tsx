import { Tooltip } from 'evergreen-ui';
import React from 'react';

import { getRerenderTimeout, RelativeTime } from 'components/relative-time';

export const DateCell = (row: { value: any }) => (
  <Tooltip content={new Date(row.value).toLocaleString()}>
    <RelativeTime
      dateString={row.value}
      getRerenderTimeout={getRerenderTimeout}
    />
  </Tooltip>
);
