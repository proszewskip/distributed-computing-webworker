import React from 'react';

import { Link } from 'components/link';

import { preventPropagationHandler } from 'utils/table/prevent-propagation-handler';

export interface LinkCellProps {
  route: string;
  text: string;
}

export const LinkCell = (row: { value: LinkCellProps }) => {
  const { value } = row;

  return (
    <Link route={row.value.route}>
      <a onClick={preventPropagationHandler} title={value.text}>
        {value.text}
      </a>
    </Link>
  );
};
