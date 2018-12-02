import React, { ReactNode, StatelessComponent } from 'react';

interface LayoutProps {
  renderSidebar: () => ReactNode;
  renderSidebarMobile: (closeSidebar: () => void) => ReactNode;
}

export const Layout: StatelessComponent<LayoutProps> = () => {
  return <div />;
};

export default Layout;
