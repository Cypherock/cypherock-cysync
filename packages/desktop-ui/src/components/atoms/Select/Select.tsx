import React from 'react';
import { SelectContainerStyle, SelectProps } from './Select.styled';

export const SelectContainer = ({ children }: SelectProps) => (
  <SelectContainerStyle>{children}</SelectContainerStyle>
);
