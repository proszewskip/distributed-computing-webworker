import { majorScale, minorScale, Pane } from 'evergreen-ui';
import React, { ReactNode, StatelessComponent } from 'react';

export interface DataTableViewProps {
  header: ReactNode;
  renderActionButtons?(): ReactNode;
}

/**
 * Displays a header with user-defined action buttons next to it, along with the children provided
 * to this component.
 */
export const DataTableView: StatelessComponent<DataTableViewProps> = ({
  header,
  renderActionButtons,
  children,
}) => (
  <Pane>
    <Pane
      display="flex"
      background="tint1"
      marginBottom={minorScale(1)}
      padding={majorScale(1)}
      alignItems="center"
    >
      <Pane flex={1}>{header}</Pane>
      {renderActionButtons && (
        <Pane display="flex">{renderActionButtons()}</Pane>
      )}
    </Pane>
    {children}
  </Pane>
);
