import { Pane } from 'evergreen-ui';
import React, { ReactNode, StatelessComponent } from 'react';

interface LayoutProps {
  renderSidebar: () => ReactNode;
}

export const Layout: StatelessComponent<LayoutProps> = ({
  children,
  renderSidebar,
}) => {
  return (
    <Pane width="100%" height="100%" display="flex">
      <Pane width={200} height="100%">
        {renderSidebar()}
      </Pane>

      <Pane flex={1} overflow="auto">
        {children}
      </Pane>
    </Pane>
  );
};

export default Layout;
