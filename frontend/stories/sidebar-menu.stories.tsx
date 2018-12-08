import centered from '@storybook/addon-centered';
import { storiesOf } from '@storybook/react';
import { Pane } from 'evergreen-ui';
import always from 'ramda/es/always';
import React from 'react';

import { SidebarMenu, SidebarMenuProps } from 'components/sidebar';

const stories = storiesOf('SidebarMenu', module);

stories
  .addDecorator((story) => (
    <Pane width={200} height={300} backgroundColor="#f3f3f3" borderRadius={10}>
      {story()}
    </Pane>
  ))
  .addDecorator(centered)
  .add('no active items', () => {
    const isActive = always(false);

    const items: SidebarMenuProps['items'] = [
      {
        route: 'foo',
        title: 'First',
        isActive,
      },
      {
        route: 'bar',
        title: 'Second',
        isActive,
      },
      {
        route: 'currently-active',
        title: 'Currently active',
        isActive,
      },
    ];

    return <SidebarMenu items={items} />;
  })
  .add('with an active item', () => {
    const items: SidebarMenuProps['items'] = [
      {
        route: 'foo',
        title: 'Non active',
        isActive: () => false,
      },
      {
        route: 'bar',
        title: 'Active',
        isActive: () => true,
      },
    ];

    return <SidebarMenu items={items} />;
  });
