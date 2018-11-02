import { FormField, InlineAlert } from 'evergreen-ui';
import React from 'react';

interface ValidatedFormFieldProps {
  visible: boolean;
  validationResult?: string;
  label: string;
  labelFor: string;
  isRequired: boolean;
}

export default class ValidatedFormField extends React.Component<
  ValidatedFormFieldProps
> {
  public render() {
    const { visible, validationResult, ...props } = this.props;

    return (
      /* tslint:disable:jsx-no-multiline-js */
      <div>
        <FormField {...props} />
        {visible &&
          validationResult && (
            <InlineAlert intent="danger" marginBottom={32}>
              {validationResult}
            </InlineAlert>
          )}
      </div>
    );
  }
}
