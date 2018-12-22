import { TextInput, Tooltip } from 'evergreen-ui';
import React, { PureComponent } from 'react';
import { FilterRender } from 'react-table';

type OnChange = (value: string) => any;

const onChangeFactory = (originalOnChange: OnChange) => (event: any) =>
  originalOnChange(event.target.value);

export interface TextFilterProps {
  filter: any;
  onChange: () => any;
}

export interface TextFilterState {
  isShown: boolean;
}

class TextFilterComponent extends PureComponent<
  TextFilterProps,
  TextFilterState
> {
  public state = {
    isShown: false,
  };

  public render() {
    const { filter, onChange } = this.props;

    return (
      <Tooltip
        content="For partial match type: 'like:value'"
        position="top"
        isShown={this.state.isShown}
      >
        <TextInput
          width="100%"
          value={filter ? filter.value : ''}
          onChange={onChangeFactory(onChange)}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
      </Tooltip>
    );
  }

  private onFocus = () => {
    this.setState({
      isShown: true,
    });
  };

  private onBlur = () => {
    this.setState({
      isShown: false,
    });
  };
}

export const TextFilter: FilterRender = (params) => (
  <TextFilterComponent {...params} />
);
