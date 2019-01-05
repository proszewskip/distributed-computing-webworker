import { Button, Pane } from 'evergreen-ui';
import React, { StatelessComponent } from 'react';

import { Link, LinkProps } from 'components/link';

export interface MenuItem {
  title: string;
  route: LinkProps['route'];
  isActive: () => boolean;
}

export interface SidebarMenuProps {
  /**
   * Items that should appear in the menu.
   */
  items: MenuItem[];
}

/**
 * The menu for the sidebar.
 *
 * @param props
 */
export const SidebarMenu: StatelessComponent<SidebarMenuProps> = (props) => {
  return (
    <Pane display="flex" flexDirection="column" alignItems="stretch">
      {props.items.map((item) => (
        <Link route={item.route} passHref={true} key={item.title}>
          <Button is="a" appearance="minimal" isActive={item.isActive()}>
            {item.title}
          </Button>
        </Link>
      ))}
    </Pane>
  );
};
