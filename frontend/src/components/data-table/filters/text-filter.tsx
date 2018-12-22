import { TextInput, Tooltip } from 'evergreen-ui';
import React, { PureComponent } from 'react';
import { FilterRender } from 'react-table';

type OnChange = (value: string) => any;

const onChangeFactory = (originalOnChange: OnChange) => (event: any) =>
  originalOnChange(event.target.value);

interface TextFilterProps {
  filter: any;
  onChange: () => void;
}

interface TextFilterState {
  isTooltipShown: boolean | null;
}

class TextFilterComponent extends PureComponent<
  TextFilterProps,
  TextFilterState
> {
  public state: TextFilterState = {
    isTooltipShown: null,
  };

  public render() {
    const { filter, onChange } = this.props;

    return (
      <Tooltip
        content="For partial match type: 'like:value'"
        position="top"
        isShown={this.state.isTooltipShown}
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
      isTooltipShown: true,
    });
  };

  private onBlur = () => {
    this.setState({
      isTooltipShown: null,
    });
  };
}

export const TextFilter: FilterRender = (params) => (
  <TextFilterComponent {...params} />
);
