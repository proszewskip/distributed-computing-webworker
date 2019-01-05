import { Heading, minorScale, Pane } from 'evergreen-ui';
import React, { ReactNode, StatelessComponent } from 'react';

export interface SidebarProps {
  title: ReactNode;
}

/**
 * The layout for the sidebar.
 */
export const Sidebar: StatelessComponent<SidebarProps> = ({
  title,
  children,
}) => {
  return (
    <Pane
      display="flex"
      flexDirection="column"
      background="tint2"
      height="100%"
    >
      <Heading
        size={600}
        marginTop="default"
        marginBottom={minorScale(2)}
        paddingX={minorScale(3)}
      >
        {title}
      </Heading>

      {children}
    </Pane>
  );
};
