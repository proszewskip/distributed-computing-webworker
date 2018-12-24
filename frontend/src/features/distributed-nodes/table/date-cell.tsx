import { Tooltip } from 'evergreen-ui';
import React from 'react';

import { RelativeTime } from 'components/relative-time';

export const DateCell = (row: { value: any }) => {
  const eventDate = new Date(row.value);

  return (
    <Tooltip content={eventDate.toLocaleString()}>
      <RelativeTime eventDate={eventDate} />
    </Tooltip>
  );
};
