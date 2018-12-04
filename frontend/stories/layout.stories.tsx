import { storiesOf } from '@storybook/react';
import { Card, Pane, Paragraph } from 'evergreen-ui';
import React, { ReactNode, StatelessComponent } from 'react';

import 'normalize.css';

import { Layout } from '../src/components/layout';
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuProps,
} from '../src/components/sidebar';

const stories = storiesOf('Layout', module);

stories.add('default layout', () => {
  const menuItems: SidebarMenuProps['items'] = [
    {
      href: 'test',
      isActive: () => false,
      title: 'Foo',
    },
    {
      href: 'test2',
      isActive: () => true,
      title: 'Bar',
    },
  ];

  const renderSidebar = () => (
    <Sidebar title="Distributed Computing">
      <SidebarMenu items={menuItems} />
    </Sidebar>
  );

  const SimpleCard: StatelessComponent = ({ children }) => (
    <Card
      width={200}
      height={200}
      display="flex"
      alignItems="center"
      justifyContent="center"
      background="greenTint"
      marginBottom={8}
    >
      {children}
    </Card>
  );

  const cards: ReactNode[] = [];

  for (let i = 0; i < 50; i++) {
    cards.push(<SimpleCard key={i}>{i}</SimpleCard>);
  }

  return (
    <Pane height={600}>
      <Layout renderSidebar={renderSidebar}>
        <Pane marginX={16}>
          <Paragraph>
            Keep in mind that the height of this demo is hardcoded to 600 px.
          </Paragraph>
          <Paragraph>
            In reality the height would be 100% of the body.
          </Paragraph>
        </Pane>

        <Pane
          display="flex"
          flexWrap="wrap"
          justifyContent="space-around"
          marginTop={8}
        >
          {cards}
        </Pane>
      </Layout>
    </Pane>
  );
});
