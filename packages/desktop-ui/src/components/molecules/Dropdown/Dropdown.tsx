import React, { ReactElement } from 'react';
import { DropDownSelectStyle, DropDownSelectProps } from './Dropdown.styled';

export const DropdownSelect = ({
  children,
  ...props
}: DropDownSelectProps): ReactElement => (
  <DropDownSelectStyle {...props}>{children}</DropDownSelectStyle>
);
