import { IconButton, minorScale } from 'evergreen-ui';
import React, { StatelessComponent } from 'react';

export interface DeleteActionButtonProps {
  disabled?: boolean;
  onClick?: () => any;
}

export const DeleteActionButton: StatelessComponent<
  DeleteActionButtonProps
> = ({ disabled, onClick }) => (
  <IconButton
    intent="danger"
    disabled={disabled}
    onClick={onClick}
    icon="trash"
    marginX={minorScale(1)}
  />
);
