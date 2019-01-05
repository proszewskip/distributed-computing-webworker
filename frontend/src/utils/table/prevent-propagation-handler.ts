import { MouseEventHandler } from 'react';

/**
 * Prevents event propagation
 * @param event
 */
export const preventPropagationHandler: MouseEventHandler = (event) =>
  event.stopPropagation();
