import { InlineAlert } from 'evergreen-ui';
import { FieldProps } from 'formik';
import React, { ComponentType, PureComponent } from 'react';

import { getDisplayName } from 'utils/get-display-name';

/**
 * A higher order component that displays validation errors for a given Formik field.
 *
 * @param WrappedComponent
 */
export function withValidation<Props extends FieldProps>(
  WrappedComponent: ComponentType<Props>,
) {
  class WithValidation extends PureComponent<Props> {
    public static displayName = `withValidation(${getDisplayName(
      WrappedComponent,
    )})`;

    public render() {
      const { field, form } = this.props;
      const { name } = field;
      const { touched, errors } = form;

      return (
        <>
          {touched[name] &&
            errors[name] && (
              <InlineAlert intent="danger">{errors[name]}</InlineAlert>
            )}
          <WrappedComponent {...this.props} />
        </>
      );
    }
  }

  return WithValidation;
}
