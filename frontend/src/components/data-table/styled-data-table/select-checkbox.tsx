import { Checkbox } from 'evergreen-ui';
import React, { PureComponent, SyntheticEvent } from 'react';

interface SelectCheckboxProps {
  checked: boolean;
  id: string;
  row: any;
  onClick: (id: string, shiftKey: boolean, row: any) => any;
}

export class SelectCheckbox extends PureComponent<SelectCheckboxProps> {
  public render() {
    const { checked } = this.props;

    return (
      <Checkbox
        marginY={0}
        checked={checked}
        onChange={this.onChange}
        onClick={this.onClick}
      />
    );
  }

  private onChange = (event: MouseEvent) => {
    const { id, row, onClick } = this.props;

    const { shiftKey } = event;
    event.stopPropagation();
    onClick(id, shiftKey, row);
  };

  /**
   * Propagation has to be stopped to prevent catching the click event on the row
   * when a checkbox has been clicked.
   */
  private onClick = (event: SyntheticEvent) => {
    event.stopPropagation();
  };
}
