import { TextInput, Tooltip } from 'evergreen-ui';
import React, { PureComponent } from 'react';

type OnChange = (value: string) => any;

export interface FilterComponentWithTooltipProps {
  filter: any;
  tooltipMessage: string;
  onChange: OnChange;
  isFilterInvalid: (filter: string) => boolean;
}

interface FilterComponentWithTooltipState {
  isTooltipShown: boolean | null;
}

/**
 * Base component for table filters.
 *
 * Contains a customizable tooltip to display information to the user about the possible values
 * of a filter.
 *
 * Handles filter validity.
 */
export class FilterComponentWithTooltip extends PureComponent<
  FilterComponentWithTooltipProps,
  FilterComponentWithTooltipState
> {
  public static defaultProps: Pick<
    FilterComponentWithTooltipProps,
    'isFilterInvalid'
  > = {
    isFilterInvalid: () => false,
  };

  public state: FilterComponentWithTooltipState = {
    isTooltipShown: null,
  };

  public render() {
    const { filter, tooltipMessage, isFilterInvalid } = this.props;

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
          onChange={this.onChange}
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

  private onChange = (event: any) => {
    const { onChange } = this.props;
    onChange(event.target.value);
  };

  private onBlur = () => {
    this.setState({
      isTooltipShown: null,
    });
  };
}
