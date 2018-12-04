import centered from '@storybook/addon-centered';
import { storiesOf } from '@storybook/react';
import { Pane } from 'evergreen-ui';
import React from 'react';

import {
  Sidebar,
  SidebarMenu,
  SidebarMenuProps,
} from '../src/components/sidebar';

const stories = storiesOf('Sidebar', module);

stories
  .addDecorator((story) => (
    <Pane width={200} height={300} backgroundColor="#f3f3f3" borderRadius={10}>
      {story()}
    </Pane>
  ))
  .addDecorator(centered)
  .add('simple header and content', () => (
    <Sidebar title="Title">Content</Sidebar>
  ))
  .add('with SidebarMenu', () => {
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

    return (
      <Sidebar title="Distributed Computing">
        <SidebarMenu items={menuItems} />
      </Sidebar>
    );
  });
