import React, { PureComponent } from 'react';

import { withRouter, WithRouterProps } from 'components/router';

import { urlMatchesRoute } from 'utils/url-matches-route';

import { MenuItem, SidebarMenu } from '../sidebar-menu';

import {
  AdvancedMenuItem,
  ConnectedSidebarMenuProps,
  SimpleMenuItem,
} from './types';
import { isSimpleMenuItem } from './utils';

type PureConnectedSidebarMenuProps = ConnectedSidebarMenuProps &
  WithRouterProps;

/**
 * A sidebar menu that supplies that allows for highlighting currently active items (based on the
 * URL)
 */
export class PureConnectedSidebarMenu extends PureComponent<
  PureConnectedSidebarMenuProps
> {
  public render() {
    const menuItems = this.getMenuItems();

    return <SidebarMenu {...this.props} items={menuItems} />;
  }

  private getMenuItems = () =>
    this.props.items.map(
      (menuItem) =>
        isSimpleMenuItem(menuItem)
          ? this.modifySimpleMenuItem(menuItem)
          : this.modifyAdvancedMenuItem(menuItem),
    );

  private modifySimpleMenuItem = (menuItem: SimpleMenuItem): MenuItem => ({
    isActive: this.currentRouteMatchesPathnamePrefix(
      menuItem.activeMatchPrefix || `${menuItem.route}/:param*`,
    ),
    ...menuItem,
  });

  private modifyAdvancedMenuItem = (menuItem: AdvancedMenuItem): MenuItem =>
    menuItem;

  private currentRouteMatchesPathnamePrefix = (pathNamePrefix: string) => {
    const urlMatcher = urlMatchesRoute(pathNamePrefix);

    return () => urlMatcher(this.props.router.pathname);
  };
}

export const ConnectedSidebarMenu = withRouter(PureConnectedSidebarMenu);
