import { Select } from 'evergreen-ui';
import React from 'react';
import { FilterRender } from 'react-table';

type OnChange = (value: string) => any;

const onChangeFactory = (originalOnChange: OnChange) => (event: any) =>
  originalOnChange(event.target.value);

export interface SelectFilterOption {
  label: string;
  value: string;
}

export const selectFilterFactory = (
  options: SelectFilterOption[],
): FilterRender => ({ filter, onChange }) => (
  <Select
    width="100%"
    value={filter ? filter.value : ''}
    onChange={onChangeFactory(onChange)}
  >
    {options.map(({ label, value }) => (
      <option key={label} value={value}>
        {label}
      </option>
    ))}
  </Select>
);
