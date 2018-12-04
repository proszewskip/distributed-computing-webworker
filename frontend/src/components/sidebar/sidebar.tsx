import { Heading, minorScale, Pane } from 'evergreen-ui';
import { defaultTheme } from 'evergreen-ui/esm/theme';
import React, { ReactNode, StatelessComponent } from 'react';

export interface SidebarProps {
  title: ReactNode;
}

export const Sidebar: StatelessComponent<SidebarProps> = ({
  title,
  children,
}) => {
  return (
    <Pane
      display="flex"
      flexDirection="column"
      backgroundColor={defaultTheme.colors.background.tint2}
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
