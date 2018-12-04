import centered from '@storybook/addon-centered';
import { storiesOf } from '@storybook/react';
import { Card, Pane, Paragraph } from 'evergreen-ui';
import React, { ReactNode, StatelessComponent } from 'react';

import 'normalize.css';

import { Layout } from 'components/layout';
import { Sidebar, SidebarMenu, SidebarMenuProps } from 'components/sidebar';

const stories = storiesOf('Layout', module);

const DefaultLayout: StatelessComponent = ({ children: additionalText }) => {
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
    <Layout renderSidebar={renderSidebar}>
      <Pane marginX={16}>{additionalText}</Pane>

      <Pane
        display="flex"
        flexWrap="wrap"
        justifyContent="space-around"
        marginTop={8}
      >
        {cards}
      </Pane>
    </Layout>
  );
};

stories.add('desktop layout', () => (
  <Pane height={600}>
    <DefaultLayout>
      <Paragraph>
        Keep in mind that the height of this demo is hardcoded to 600 px.
      </Paragraph>

      <Paragraph>In reality the height would be 100% of the body.</Paragraph>
    </DefaultLayout>
  </Pane>
));

stories.addDecorator(centered).add('mobile layout', () => (
  <Pane height={600} width={375}>
    <DefaultLayout>
      <Paragraph>
        Keep in mind that the height of this demo is hardcoded to 600 px.
      </Paragraph>

      <Paragraph>In reality the height would be 100% of the body.</Paragraph>

      <Paragraph>
        The width has been hardcoded to 375 px to simulate a mobile device.
      </Paragraph>
    </DefaultLayout>
  </Pane>
));