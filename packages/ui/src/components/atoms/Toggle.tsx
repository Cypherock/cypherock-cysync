import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

import { goldenGradient } from '../utils/Gradient';

interface ToggleProps {
  checked: boolean;
  onToggle?: (checked: boolean) => void;
}

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 32px;
  height: 16px;
  margin-left: 8px;
`;

const Slider = styled.span<{ checked: boolean }>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  ${({ checked, theme }) =>
    checked
      ? goldenGradient('background')
      : `background-color: ${theme.palette.background.separator}`};

  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 41px;
  &:before {
    position: absolute;
    content: '';
    height: 10px;
    width: 10px;
    left: ${({ checked }) => (checked ? '16px' : '3px')};
    bottom: 3px;
    background-color: ${({ checked, theme }) =>
      checked
        ? theme.palette.background.toggleActive
        : theme.palette.background.toggle};
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const Checkbox = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

export const Toggle: React.FC<ToggleProps> = ({ checked, onToggle }) => {
  const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
    if (onToggle) {
      onToggle(event.target.checked);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLLabelElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (onToggle) {
        onToggle(!checked);
      }
    }
  };

  return (
    <ToggleSwitch tabIndex={0} onKeyDown={handleKeyDown}>
      <Checkbox
        type="checkbox"
        checked={checked}
        onChange={handleCheck}
        tabIndex={-1}
      />
      <Slider checked={checked} />
    </ToggleSwitch>
  );
};

Toggle.defaultProps = {
  onToggle: undefined,
};
