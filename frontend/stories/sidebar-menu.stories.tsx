import centered from '@storybook/addon-centered';
import { storiesOf } from '@storybook/react';
import { Pane } from 'evergreen-ui';
import always from 'ramda/es/always';
import React, { StatelessComponent } from 'react';

import { SidebarMenu, SidebarMenuProps } from '../src/components/sidebar';

const stories = storiesOf('SidebarMenu', module);

const Wrapper: StatelessComponent = ({ children }) => (
  <Pane width={200} height={300} backgroundColor="#f3f3f3" borderRadius={10}>
    {children}
  </Pane>
);

stories
  .addDecorator(centered)
  .add('no active items', () => {
    const isActive = always(false);

    const items: SidebarMenuProps['items'] = [
      {
        href: 'foo',
        title: 'First',
        isActive,
      },
      {
        href: 'bar',
        title: 'Second',
        isActive,
      },
      {
        href: 'currently-active',
        title: 'Currently active',
        isActive,
      },
    ];

    return (
      <Wrapper>
        <SidebarMenu items={items} />
      </Wrapper>
    );
  })
  .add('with an active item', () => {
    const items: SidebarMenuProps['items'] = [
      {
        href: 'foo',
        title: 'Non active',
        isActive: () => false,
      },
      {
        href: 'bar',
        title: 'Active',
        isActive: () => true,
      },
    ];

    return (
      <Wrapper>
        <SidebarMenu items={items} />
      </Wrapper>
    );
  })
  .add('using advanced href', () => {
    const isActive = always(false);

    const items: SidebarMenuProps['items'] = [
      {
        href: { path: 'foo', search: 'bar' },
        title: 'With search params',
        isActive,
      },
      {
        href: { path: 'bar', query: { first: 'foo', extra: 'bar' } },
        title: 'With query params',
        isActive,
      },
    ];

    return (
      <Wrapper>
        <SidebarMenu items={items} />
      </Wrapper>
    );
  });
