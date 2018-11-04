import { InlineAlert } from 'evergreen-ui';
import { FieldProps } from 'formik';
import React, { ComponentType, PureComponent } from 'react';

export function withValidation<Props extends FieldProps>(
  WrappedComponent: ComponentType<Props>,
) {
  class WithValidation extends PureComponent<Props> {
    public render() {
      const { field, form } = this.props;
      const { name } = field;
      const { touched, errors } = form;

      return (
        <div>
          {touched[name] &&
            errors[name] && (
              <InlineAlert intent="danger">{errors[name]}</InlineAlert>
            )}
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  }

  return WithValidation;
}
