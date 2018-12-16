import { TextInput } from 'evergreen-ui';
import React from 'react';
import { FilterRender } from 'react-table';

type OnChange = (value: string) => any;

const onChangeFactory = (originalOnChange: OnChange) => (event: any) => {
  const { value } = event.target;

  if (value === '') {
    originalOnChange('');
    return;
  }

  const parsedNumber = parseInt(value, 10);

  if (!Number.isNaN(parsedNumber)) {
    originalOnChange(value);
  }
};

export const NumberFilter: FilterRender = ({ filter, onChange }) => (
  <TextInput
    width="100%"
    value={filter ? filter.value : ''}
    onChange={onChangeFactory(onChange)}
  />
);
