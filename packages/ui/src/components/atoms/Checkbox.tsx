import React, { FC } from 'react';
import styled from 'styled-components';

interface CheckBoxProps {
  checked: boolean;
  onChange: () => void;
}

const CheckBoxStyle = styled.input.attrs({
  type: 'checkbox',
  id: 'checkbox_id',
})`
  -webkit-appearance: none;
`;

const CheckBoxIcon = styled.div`
  background-image: ${({ theme }) => theme.palette.golden};
  width: 8px;
  height: 8px;
  position: absolute;
  top: 1px;
  left: 1px;
  border-radius: 2px;
  transform: translate(21%, 40%);
`;

const CheckBoxLabelStyle = styled.label.attrs({ htmlFor: 'checkbox_id' })`
  width: 16px;
  height: 16px;
  border-radius: 3px;
  background-image: ${({ theme }) => theme.palette.golden};
  position: relative;

  &:before {
    content: '';
    width: 11.5px;
    height: 11px;
    border-radius: 2px;
    position: absolute;
    top: 1px;
    left: 1px;
    transform: translate(0%, 15%);
    background-image: ${({ theme }) => theme.palette.background.sideBar};
  }
`;

export const CheckBox: FC<CheckBoxProps> = ({ checked, onChange }) => (
  <>
    <CheckBoxStyle checked={checked} onChange={onChange} />
    <CheckBoxLabelStyle>{checked && <CheckBoxIcon />}</CheckBoxLabelStyle>
  </>
);
