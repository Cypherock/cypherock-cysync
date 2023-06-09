import React, { FC } from 'react';
import styled from 'styled-components';

interface CheckBoxProps {
  checked: boolean;
  onChange: () => void;
  id: string;
}

const CheckBoxStyle = styled.input.attrs(props => ({
  type: 'checkbox',
  id: props.id,
}))`
  -webkit-appearance: none;
`;

const CheckBoxIcon = styled.div`
  background-image: ${({ theme }) => theme.palette.golden};
  width: 8px;
  height: 8px;
  position: absolute;
  top: 4px;
  left: 4px;
  border-radius: 2px;
`;

const CheckBoxLabelStyle = styled.label.attrs(props => ({
  htmlFor: props.id,
}))`
  width: 18px;
  height: 16px;
  border-radius: 3px;
  background-image: ${({ theme }) => theme.palette.golden};
  position: relative;

  &:before {
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 2px;
    position: absolute;
    top: 2px;
    left: 2px;
    background-image: ${({ theme }) => theme.palette.background.sideBar};
  }
`;

export const CheckBox: FC<CheckBoxProps> = ({ checked, onChange, id }) => (
  <>
    <CheckBoxStyle checked={checked} onChange={onChange} id={id} />
    <CheckBoxLabelStyle id={id}>
      {checked && <CheckBoxIcon id={id} />}
    </CheckBoxLabelStyle>
  </>
);
