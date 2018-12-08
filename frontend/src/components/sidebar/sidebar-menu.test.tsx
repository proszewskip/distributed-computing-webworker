import React from 'react';
import renderer from 'react-test-renderer';

import { SidebarMenu, SidebarMenuProps } from './sidebar-menu';

describe('SidebarMenu', () => {
  it('should match snapshot', () => {
    const menuItems: SidebarMenuProps['items'] = [
      {
        href: 'abc',
        title: 'Abc',
        isActive: () => true,
      },
      {
        href: 'notactive',
        title: 'Not active',
        isActive: () => false,
      },
    ];

    const instance = renderer.create(<SidebarMenu items={menuItems} />);
    expect(instance.toJSON()).toMatchSnapshot();
  });
});
