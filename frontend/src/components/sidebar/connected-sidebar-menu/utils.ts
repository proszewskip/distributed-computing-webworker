import { ConnectedMenuItem, SimpleMenuItem } from './types';

export function isSimpleMenuItem(
  menuItem: ConnectedMenuItem,
): menuItem is SimpleMenuItem {
  return typeof menuItem.href === 'string';
}
