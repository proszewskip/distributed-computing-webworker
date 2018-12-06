import { Card, Pane } from 'evergreen-ui';
import React from 'react';

import 'styles.css';

import { Layout, LayoutProps } from 'components/layout';
import { Sidebar, SidebarMenu } from 'components/sidebar';
import { SidebarMenuProps } from 'components/sidebar';

const always = <T extends {}>(v: T) => () => v;

export const sidebarMenuItems: SidebarMenuProps['items'] = [
  {
    href: '/home',
    title: 'Home',
    isActive: always(false),
  },
  {
    href: '/table-example',
    title: 'Table example',
    isActive: always(false),
  },
  {
    href: '/form-example',
    title: 'Form example',
    isActive: always(false),
  },
];

const renderSidebar: LayoutProps['renderSidebar'] = () => (
  <Sidebar title="Distributed Computing">
    <SidebarMenu items={sidebarMenuItems} />
  </Sidebar>
);

const Index = () => (
  <Layout renderSidebar={renderSidebar}>
    <Pane display="flex" justifyContent="center" marginTop="2em">
      <Card padding={80} border="default" background="tint2">
        Info here
      </Card>
    </Pane>
  </Layout>
);

export default Index;
