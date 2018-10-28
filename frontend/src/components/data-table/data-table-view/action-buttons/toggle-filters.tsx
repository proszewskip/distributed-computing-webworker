import { IconButton, minorScale } from 'evergreen-ui';
import React, { StatelessComponent } from 'react';

export interface ToggleFiltersActionButtonProps {
  filtersEnabled: boolean;
  onClick?: () => any;
}

export const ToggleFiltersActionButton: StatelessComponent<
  ToggleFiltersActionButtonProps
> = ({ onClick, filtersEnabled }) => (
  <IconButton
    appearance={filtersEnabled ? 'primary' : 'default'}
    intent={filtersEnabled ? 'success' : 'none'}
    onClick={onClick}
    icon="filter"
    marginX={minorScale(1)}
  />
);
