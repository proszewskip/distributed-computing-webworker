import React, { StatelessComponent } from 'react';

import { ConnectedSidebarMenu, Sidebar } from 'components/sidebar';

import { unauthenticatedSidebarMenuItems } from './unauthenticated-sidebar-menu-items';

export const UnauthenticatedSidebar: StatelessComponent = () => (
  <Sidebar title="Distributed Computing">
    <ConnectedSidebarMenu items={unauthenticatedSidebarMenuItems} />
  </Sidebar>
);
