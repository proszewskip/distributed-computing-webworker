import React, { StatelessComponent } from 'react';

import { ConnectedSidebarMenu, Sidebar } from 'components/sidebar';

import { authenticatedSidebarMenuItems } from './authenticated-sidebar-menu-items';

/**
 * Sidebar component that should be displayed when the user is authenticated.
 */
export const AuthenticatedSidebar: StatelessComponent = () => (
  <Sidebar title="Distributed Computing">
    <ConnectedSidebarMenu items={authenticatedSidebarMenuItems} />
  </Sidebar>
);
