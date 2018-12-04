import { Button, Pane } from 'evergreen-ui';
import Link, { LinkProps } from 'next/link';
import React, { StatelessComponent } from 'react';

export interface MenuItem {
  title: string;
  href: LinkProps['href'];
  isActive: () => boolean;
}

export interface SidebarMenuProps {
  items: MenuItem[];
}

export const SidebarMenu: StatelessComponent<SidebarMenuProps> = (props) => {
  return (
    <Pane display="flex" flexDirection="column" alignItems="stretch">
      {props.items.map((item) => (
        <Link href={item.href} passHref={true} key={item.title}>
          <Button is="a" appearance="minimal" isActive={item.isActive()}>
            {item.title}
          </Button>
        </Link>
      ))}
    </Pane>
  );
};
