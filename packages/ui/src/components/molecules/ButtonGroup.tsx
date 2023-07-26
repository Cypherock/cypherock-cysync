import React, { useState } from 'react';
import styled from 'styled-components';

const ButtonGroupContainer = styled.div`
  display: inline-flex;
  border-radius: 20px;
  padding: 2px;
`;

const PillButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: none;
  background-color: ${({ active, theme }) =>
    active ? `${theme.palette.background.gold}` : 'transparent'};
  color: ${({ active }) => (active ? '#fff' : '#333')};
  border-radius: 0;
  cursor: pointer;
  outline: none;
  &:first-child {
    border-radius: 20px 0 0 20px;
  }

  &:last-child {
    border-right: none; /* Remove right border for the last button */
    border-radius: 0 20px 20px 0;
  }
  width: auto;
  flex-grow: 1;
  height: 16px;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

interface PillButtonGroupProps {
  buttons: string[];
}

export const ButtonGroup: React.FC<PillButtonGroupProps> = ({ buttons }) => {
  const [activeButton, setActiveButton] = useState(0);

  const handleButtonClick = (index: number) => {
    setActiveButton(index);
  };

  return (
    <ButtonGroupContainer>
      {buttons.map((label, index) => (
        <PillButton
          key={label}
          active={activeButton === index}
          onClick={() => handleButtonClick(index)}
        >
          {label}
        </PillButton>
      ))}
    </ButtonGroupContainer>
  );
};
