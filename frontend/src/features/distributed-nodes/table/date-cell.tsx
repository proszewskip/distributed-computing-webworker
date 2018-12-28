import React from 'react';

import { RelativeTime } from 'components/relative-time';

export const DateCell = (row: { value: any }) => {
  const eventDate = new Date(row.value);

  return (
    <div title={eventDate.toLocaleString()}>
      <RelativeTime eventDate={eventDate} />
    </div>
  );
};
