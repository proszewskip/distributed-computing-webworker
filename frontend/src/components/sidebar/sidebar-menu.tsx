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
    <ul>
      {props.items.map((item) => (
        <li key={item.title}>
          <Link href={item.href}>
            <a>
              {item.title} {item.isActive() && 'active'}
            </a>
          </Link>
        </li>
      ))}
    </ul>
  );
};
