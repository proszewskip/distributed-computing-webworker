import { IconButton, minorScale } from 'evergreen-ui';
import React, { StatelessComponent } from 'react';

export interface RefreshActionButtonProps {
  disabled?: boolean;
  onClick?: () => any;
}

export const RefreshActionButton: StatelessComponent<
  RefreshActionButtonProps
> = ({ disabled, onClick }) => (
  <IconButton
    disabled={disabled}
    onClick={onClick}
    icon="refresh"
    marginX={minorScale(1)}
  />
);
