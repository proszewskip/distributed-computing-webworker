import centered from '@storybook/addon-centered';
import { storiesOf } from '@storybook/react';
import { Pane } from 'evergreen-ui';
import React, { StatelessComponent } from 'react';

import {
  Sidebar,
  SidebarMenu,
  SidebarMenuProps,
} from '../src/components/sidebar';

const stories = storiesOf('Sidebar', module);

const Wrapper: StatelessComponent = ({ children }) => (
  <Pane width={200} height={300} backgroundColor="#f3f3f3" borderRadius={10}>
    {children}
  </Pane>
);

stories
  .addDecorator(centered)
  .add('simple header and content', () => {
    return (
      <Wrapper>
        <Sidebar title="Title">Content</Sidebar>
      </Wrapper>
    );
  })
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
      <Wrapper>
        <Sidebar title="Distributed Computing">
          <SidebarMenu items={menuItems} />
        </Sidebar>
      </Wrapper>
    );
  });
