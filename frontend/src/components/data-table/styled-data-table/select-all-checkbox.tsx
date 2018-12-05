import { Checkbox } from 'evergreen-ui';
import React, { PureComponent, SyntheticEvent } from 'react';
import { SelectAllInputComponentProps } from 'react-table/lib/hoc/selectTable';

export class SelectAllCheckbox extends PureComponent<
  SelectAllInputComponentProps
> {
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
    const { onClick } = this.props;

    event.stopPropagation();
    onClick();
  };

  /**
   * Propagation has to be stopped to prevent catching the click event on the row
   * when a checkbox has been clicked.
   */
  private onClick = (event: SyntheticEvent) => {
    event.stopPropagation();
  };
}
