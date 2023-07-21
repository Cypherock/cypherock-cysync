import React, { FC } from 'react';
import styled from 'styled-components';

interface RadioButtonProps {
  checked: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

const StyledRadioButton = styled.div<RadioButtonProps>`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.palette.text.goldenrod};
  position: relative;
  cursor: pointer;

  &:after {
    content: '';
    display: ${props => (props.checked ? 'block' : 'none')};
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background-color: ${({ theme }) => theme.palette.text.goldenrod};
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
`;

export const RadioButton: FC<RadioButtonProps> = ({
  checked,
  value = '',
  onChange,
}) => (
  <StyledRadioButton
    checked={checked}
    onClick={() => onChange && onChange(value)}
  />
);

RadioButton.defaultProps = {
  value: '',
  onChange: undefined,
};
