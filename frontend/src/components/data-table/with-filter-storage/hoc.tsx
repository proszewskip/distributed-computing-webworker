import { ComponentType, PureComponent } from 'react';
import { FilteredChangeFunction, TableProps } from 'react-table';

import { Omit } from 'types/omit';
import { getDisplayName } from 'utils/get-display-name';

export interface WithFilterStorageAdditionalProps {
  initialFiltered?: TableProps['filtered'];
}

interface WithFilterStorageState {
  filtered: NonNullable<TableProps['filtered']>;
}

export function withFilterStorage<Props extends Partial<TableProps>>(
  WrappedComponent: ComponentType<Props>,
) {
  type WithFilterStorageOptionalProps = Pick<
    Props,
    'children' | 'onFilteredChange'
  >;
  type WithFilterStorageProps = Omit<Props, 'filtered'> &
    WithFilterStorageAdditionalProps &
    WithFilterStorageOptionalProps;

  class WithFilterStorage extends PureComponent<
    WithFilterStorageProps,
    WithFilterStorageState
  > {
    public static displayName = `withFilterStorage(${getDisplayName(
      WrappedComponent,
    )})`;

    public static defaultProps: Partial<TableProps> = {
      onFilteredChange: () => null,
    };

    constructor(props: WithFilterStorageProps) {
      super(props);

      this.state = {
        filtered: props.initialFiltered || [],
      };
    }

    public render() {
      return (
        <WrappedComponent
          {...this.props}
          filtered={this.state.filtered}
          onFilteredChange={this.onFilteredChange}
        />
      );
    }

    private onFilteredChange: FilteredChangeFunction = (filtered, ...args) => {
      this.setState({ filtered }, () =>
        this.notifyOnFilteredChange(filtered, ...args),
      );
    };

    private notifyOnFilteredChange: FilteredChangeFunction = (...args) => {
      if (this.props.onFilteredChange) {
        this.props.onFilteredChange(...args);
      }
    };
  }

  return WithFilterStorage;
}
