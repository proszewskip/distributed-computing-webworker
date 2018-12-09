import { Omit } from 'types/omit';

import { MenuItem, SidebarMenuProps } from '../sidebar-menu';

type SharedMenuItemProperties = Omit<MenuItem, 'isActive'>;

/**
 * A menu item that is active whenever the url matches the `route`.
 */
export interface SimpleMenuItem extends SharedMenuItemProperties {
  /**
   * The URL prefix that will be used to determine if the item is active (based on the current route)
   * When not supplied it defaults to the `route`
   */
  activeMatchPrefix?: string;
  isActive?: MenuItem['isActive'];
}

export interface AdvancedMenuItem extends SharedMenuItemProperties {
  isActive: MenuItem['isActive'];
}

export type ConnectedMenuItem = SimpleMenuItem | AdvancedMenuItem;

export interface ConnectedSidebarMenuProps
  extends Omit<SidebarMenuProps, 'items'> {
  items: ConnectedMenuItem[];
}
