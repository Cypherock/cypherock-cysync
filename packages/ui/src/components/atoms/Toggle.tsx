import styled from 'styled-components';
import React, { useState, ChangeEvent } from 'react';

interface ToggleProps {
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
  background-color: ${({ checked }) => (checked ? '#D4AF37' : '#39322C')};
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
    background-color: ${({ checked }) => (checked ? '#000000' : '#544D43')};
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

export const Toggle: React.FC<ToggleProps> = ({ onToggle }) => {
  const [checked, setChecked] = useState<boolean>(false);
  const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    if (onToggle) {
      onToggle(event.target.checked);
    }
  };

  return (
    <ToggleSwitch>
      <Checkbox type="checkbox" checked={checked} onChange={handleCheck} />
      <Slider checked={checked} />
    </ToggleSwitch>
  );
};

Toggle.defaultProps = {
  onToggle: undefined,
};
