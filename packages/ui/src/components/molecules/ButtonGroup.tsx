import React from 'react';
import styled from 'styled-components';

const ButtonGroupContainer = styled.div`
  display: inline-flex;
  border-radius: 20px;
  padding: 2px;
`;

const PillButton = styled.button<{ $active: boolean }>`
  border: none;
  background: ${({ theme, $active }) =>
    $active
      ? `${theme.palette.background.gold}`
      : `${theme.palette.background.separatorSecondary}`};
  color: ${({ theme, $active }) =>
    $active
      ? `${theme.palette.background.toggleActive}`
      : `${theme.palette.text.muted}`};
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
  width: 56px;
  height: 16px;
  display: flex; /* Add this to enable flex layout */
  font-size: 8px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 1px;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* Hide overflowing content */
  text-overflow: ellipsis; /* Display ellipsis (...) for overflowing text */
  white-space: nowrap; /* Prevent text from wrapping to a new line */
`;

export interface ButtonAttributes {
  id: number;
  label: string;
}

interface PillButtonGroupProps {
  buttons: ButtonAttributes[];
  activeButtonId: number; // Active button index provided from parent component
  onButtonClick: (index: number) => void; // Callback function to handle button clicks in parent component
}

export const ButtonGroup: React.FC<PillButtonGroupProps> = ({
  buttons,
  activeButtonId,
  onButtonClick,
}) => (
  <ButtonGroupContainer>
    {buttons.map(({ id, label }) => (
      <PillButton
        key={id}
        $active={activeButtonId === id}
        onClick={() => onButtonClick(id)} // Call the callback function with the button id
      >
        {label}
      </PillButton>
    ))}
  </ButtonGroupContainer>
);

export default ButtonGroup;
