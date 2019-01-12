import { Text } from 'evergreen-ui';
import React from 'react';

import { Link } from 'components/link';

import { preventPropagationHandler } from 'utils/table/prevent-propagation-handler';

export interface LinkCellProps {
  /**
   * URL
   */
  route: string;

  /**
   * Text to be displayed
   */
  text: string;
}

/**
 * A link as a table cell.
 *
 * @param row
 */
export const LinkCell = (row: { value: LinkCellProps }) => {
  const { value } = row;

  return (
    <Link route={row.value.route}>
      <a onClick={preventPropagationHandler} title={value.text}>
        <Text>{value.text}</Text>
      </a>
    </Link>
  );
};
