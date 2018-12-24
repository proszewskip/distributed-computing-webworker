import { TextInput, Tooltip } from 'evergreen-ui';
import React, { PureComponent } from 'react';

type OnChange = (value: string) => any;

const onChangeFactory = (originalOnChange: OnChange) => (event: any) =>
  originalOnChange(event.target.value);

export interface FilterComponentWithTooltipProps {
  filter: any;
  tooltipMessage: string;
  onChange: () => void;
}

interface FilterComponentWithTooltipState {
  isTooltipShown: boolean | null;
}

export class FilterComponentWithTooltip extends PureComponent<
  FilterComponentWithTooltipProps,
  FilterComponentWithTooltipState
> {
  public state: FilterComponentWithTooltipState = {
    isTooltipShown: null,
  };

  public render() {
    const { filter, onChange, tooltipMessage } = this.props;

    return (
      <Tooltip
        content={tooltipMessage}
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
