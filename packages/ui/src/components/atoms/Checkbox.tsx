import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

interface CheckBoxProps {
  children?: ReactNode;
  variant?: 'square' | 'round';
}

const CheckBoxStyle = styled.div<CheckBoxProps>`
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  background-image: ${({ theme }) => theme.palette.golden};

  div {
    width: 13px;
    height: 13px;
    border-radius: 3px;
    background-image: ${({ theme }) => theme.palette.background.sideBar};
    display: flex;
    justify-content: center;
    align-items: center;
  }

  input {
    -webkit-appearance: none;
    position: relative;
    width: 8px;
    height: 8px;
    border-radius: 2px;
    background-image: ${({ theme }) => theme.palette.background.sideBar};
    cursor: pointer;
  }

  input:checked {
    background-image: ${({ theme }) => theme.palette.golden};
  }

  input::before {
    content: '';
    position: absolute;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    pointer-events: none;
    background-size: contain;
    background-repeat: no-repeat;
  }

  input::before {
    display: none;
  }

  input:checked::before {
    display: block;
  }
`;

export const CheckBox: FC<CheckBoxProps> = ({ children, ...props }) => (
  <CheckBoxStyle {...props}>{children}</CheckBoxStyle>
);

CheckBox.defaultProps = {
  children: null,
  variant: 'square',
};
