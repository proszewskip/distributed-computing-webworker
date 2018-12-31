import { TextInput, Tooltip } from 'evergreen-ui';
import React, { PureComponent } from 'react';

type OnChange = (value: string) => any;

const onChangeFactory = (originalOnChange: OnChange) => (event: any) =>
  originalOnChange(event.target.value);

export interface FilterComponentWithTooltipProps {
  filter: any;
  tooltipMessage: string;
  onChange: () => void;
  isFilterInvalid: (filter: string) => boolean;
}

interface FilterComponentWithTooltipState {
  isTooltipShown: boolean | null;
}

export class FilterComponentWithTooltip extends PureComponent<
  FilterComponentWithTooltipProps,
  FilterComponentWithTooltipState
> {
  public static defaultProps: Partial<FilterComponentWithTooltipProps> = {
    isFilterInvalid: () => false,
  };

  public state: FilterComponentWithTooltipState = {
    isTooltipShown: null,
  };

  public render() {
    const { filter, onChange, tooltipMessage, isFilterInvalid } = this.props;

    return (
      <Tooltip
        content={tooltipMessage}
        position="top"
        isShown={this.state.isTooltipShown}
      >
        <TextInput
          isInvalid={filter ? isFilterInvalid(filter.value) : false}
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
