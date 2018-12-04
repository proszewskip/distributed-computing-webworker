import React, { StatelessComponent } from 'react';
import MediaQuery, { MediaQueryProps } from 'react-responsive';

const maxMobileWidth = 767;
const minDesktopWidth = maxMobileWidth + 1;

export const Mobile: StatelessComponent<MediaQueryProps> = (props) => (
  <MediaQuery maxWidth={maxMobileWidth} {...props} />
);
export const Desktop: StatelessComponent<MediaQueryProps> = (props) => (
  <MediaQuery minWidth={minDesktopWidth} {...props} />
);
