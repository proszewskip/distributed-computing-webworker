import { FormField } from 'evergreen-ui';
import { FieldProps } from 'formik';
import React, { ComponentType, PureComponent } from 'react';

interface WithLabelAdditionalProps {
  label: string;
  isRequired?: boolean;
}

export function withLabel<Props extends FieldProps>(
  WrappedComponent: ComponentType<Props>,
) {
  type WithLabelProps = Props & WithLabelAdditionalProps;
  class WithLabel extends PureComponent<WithLabelProps> {
    public render() {
      const { label, isRequired, field } = this.props;
      const { name } = field;

      return (
        <div>
          <FormField labelFor={name} label={label} isRequired={isRequired} />
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  }

  return WithLabel;
}
