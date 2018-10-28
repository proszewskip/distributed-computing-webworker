import { Checkbox } from 'evergreen-ui';
import React, { PureComponent } from 'react';

interface SelectCheckboxProps {
  checked: boolean;
  id: string;
  row: any;
  onClick: (id: string, shiftKey: boolean, row: any) => any;
}

export class SelectCheckbox extends PureComponent<SelectCheckboxProps> {
  public render() {
    const { checked } = this.props;

    return <Checkbox marginY={0} checked={checked} onChange={this.onChange} />;
  }

  private onChange = (e: any) => {
    const { id, row, onClick } = this.props;

    const { shiftKey } = e;
    e.stopPropagation();
    onClick(id, shiftKey, row);
  };
}
