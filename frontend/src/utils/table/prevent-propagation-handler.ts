import { MouseEventHandler } from 'react';

export const preventPropagationHandler: MouseEventHandler = (event) =>
  event.stopPropagation();
