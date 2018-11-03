import { ComponentType } from 'react';

export type ComponentProps<Component> = Component extends ComponentType<
  infer Props
>
  ? Props
  : never;
