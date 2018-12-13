import { Select } from 'evergreen-ui';
import React from 'react';
import { FilterRender } from 'react-table';

import { SubtaskStatus } from 'models';

type OnChange = (value: string) => any;

const onChangeFactory = (originalOnChange: OnChange) => (event: any) =>
  originalOnChange(event.target.value);

export const SubtaskStatusFilter: FilterRender = ({ filter, onChange }) => (
  <Select
    width="100%"
    height={40}
    onChange={onChangeFactory(onChange)}
    value={filter ? filter.value : ''}
  >
    <option value={SubtaskStatus.Done}>Done</option>
    <option value={SubtaskStatus.Error}>Error</option>
    <option value={SubtaskStatus.WaitingForExecution}>
      Waiting for execution
    </option>
    <option value={SubtaskStatus.Executing}>In progress</option>
  </Select>
);
