import React, { StatelessComponent } from 'react';

import { ConnectedSidebarMenu, Sidebar } from 'components/sidebar';
import { authenticatedSidebarMenuItems } from './authenticated-sidebar-menu-items';

export const AuthenticatedSidebar: StatelessComponent = () => (
  <Sidebar title="Distributed Computing">
    <ConnectedSidebarMenu items={authenticatedSidebarMenuItems} />
  </Sidebar>
);
