import React, { FC } from 'react';
import styled from 'styled-components';

import { goldenGradient } from '../utils';

interface RadioButtonProps {
  checked: boolean;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const StyledRadioButton = styled.div<RadioButtonProps>`
  display: inline-block;
  width: 12px;
  height: 12px;
  min-width: 12px;
  min-height: 12px;
  border-radius: 50%;
  position: relative;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid transparent;
    background: ${({ disabled, theme }) =>
        disabled ? theme.palette.text.disabled : theme.palette.golden}
      border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  &:after {
    content: '';
    display: ${props => (props.checked ? 'block' : 'none')};
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    ${goldenGradient('background')};
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
`;

export const RadioButton: FC<RadioButtonProps> = ({
  checked,
  value = '',
  onChange,
  disabled = false,
}) => (
  <StyledRadioButton
    checked={checked}
    disabled={disabled}
    onClick={() => onChange && onChange(value)}
  />
);

RadioButton.defaultProps = {
  value: '',
  onChange: undefined,
  disabled: false,
};
