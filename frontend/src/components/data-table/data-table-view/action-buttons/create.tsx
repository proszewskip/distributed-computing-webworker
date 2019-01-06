import { IconButton, minorScale } from 'evergreen-ui';
import React, { StatelessComponent } from 'react';

export interface CreateActionButtonProps {
  disabled?: boolean;
  onClick?: () => any;
}

export const CreateActionButton: StatelessComponent<
  CreateActionButtonProps
> = ({ disabled, onClick }) => (
  <IconButton
    intent="success"
    disabled={disabled}
    onClick={onClick}
    icon="plus"
    appearance="primary"
    marginX={minorScale(1)}
    title="Create"
  />
);
