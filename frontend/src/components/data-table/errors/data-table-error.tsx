import { minorScale, Pane } from 'evergreen-ui';
import React, { StatelessComponent } from 'react';

import { RequestErrorInfo, RequestErrorInfoProps } from 'components/errors';

export interface DataTableErrorProps {
  error: RequestErrorInfoProps['error'];
}

export const DataTableError: StatelessComponent<DataTableErrorProps> = ({
  error,
}) => (
  <Pane margin={minorScale(2)}>
    <RequestErrorInfo error={error} />
  </Pane>
);
