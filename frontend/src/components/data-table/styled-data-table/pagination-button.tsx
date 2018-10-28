import { Button } from 'evergreen-ui';
import React, { StatelessComponent } from 'react';

interface PaginationButtonProps {
  onClick: () => any;
  disabled: boolean;
}

export const PaginationButton: StatelessComponent<PaginationButtonProps> = ({
  onClick,
  disabled,
  children,
}) => (
  <Button
    appearance="default"
    width="50%"
    justifyContent="center"
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </Button>
);
