import { ComponentType } from 'react';

/**
 * A type that extracts the type of the props of a component.
 */
export type ComponentProps<Component> = Component extends ComponentType<
  infer Props
>
  ? Props
  : never;
