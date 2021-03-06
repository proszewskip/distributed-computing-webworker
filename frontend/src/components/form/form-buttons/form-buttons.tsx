import { Button, majorScale, Pane } from 'evergreen-ui';
import React, { StatelessComponent } from 'react';

export interface FormButtonsProps {
  onCancelClick: () => void;
  isSubmitting: boolean;
}

/**
 * The _Cancel_ and _Submit_ buttons that should be used in forms.
 *
 * @param props
 */
export const FormButtons: StatelessComponent<FormButtonsProps> = (props) => {
  return (
    <Pane marginTop={majorScale(1)}>
      <Button type="button" onClick={props.onCancelClick}>
        Cancel
      </Button>

      <Button
        type="submit"
        disabled={props.isSubmitting}
        appearance="primary"
        marginLeft={majorScale(1)}
      >
        Submit
      </Button>
    </Pane>
  );
};
