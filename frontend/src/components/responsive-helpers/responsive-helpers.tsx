import React, { StatelessComponent } from 'react';
import MediaQuery, { MediaQueryProps } from 'react-responsive';

const maxMobileWidth = 599;
const minDesktopWidth = maxMobileWidth + 1;

/**
 * Displays children only when on mobile
 *
 * @param props
 */
export const Mobile: StatelessComponent<MediaQueryProps> = (props) => (
  <MediaQuery maxWidth={maxMobileWidth} {...props} />
);

/**
 * Displays children only when on desktop
 *
 * @param props
 */
export const Desktop: StatelessComponent<MediaQueryProps> = (props) => (
  <MediaQuery minWidth={minDesktopWidth} {...props} />
);
