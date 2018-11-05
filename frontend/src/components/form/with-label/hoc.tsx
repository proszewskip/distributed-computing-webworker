import { FormField } from 'evergreen-ui';
import { FieldProps } from 'formik';
import React, { ComponentType, PureComponent } from 'react';

import { getDisplayName } from 'utils/get-display-name';

interface WithLabelAdditionalProps {
  label: string;
  isRequired?: boolean;
}

export function withLabel<Props extends FieldProps>(
  WrappedComponent: ComponentType<Props>,
) {
  type WithLabelProps = Props & WithLabelAdditionalProps;
  class WithLabel extends PureComponent<WithLabelProps> {
    public static displayName = `withLabel(${getDisplayName(
      WrappedComponent,
    )})`;

    public render() {
      const { label, isRequired, field } = this.props;
      const { name } = field;

      return (
        <>
          <FormField labelFor={name} label={label} isRequired={isRequired} />
          <WrappedComponent {...this.props} />
        </>
      );
    }
  }

  return WithLabel;
}
