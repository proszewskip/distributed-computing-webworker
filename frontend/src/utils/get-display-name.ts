import { ComponentType } from 'react';

/**
 * Returns the display name of a component.
 *
 * @param WrappedComponent
 */
export function getDisplayName(WrappedComponent: ComponentType<any>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
