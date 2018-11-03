import { TextInput } from 'evergreen-ui';
import React from 'react';
import { FilterRender } from 'react-table';

type OnChange = (value: string) => any;

const onChangeFactory = (originalOnChange: OnChange) => (event: any) =>
  originalOnChange(event.target.value);

export const TextFilter: FilterRender = ({ filter, onChange }) => (
  <TextInput
    width="100%"
    value={filter ? filter.value : ''}
    onChange={onChangeFactory(onChange)}
  />
);
