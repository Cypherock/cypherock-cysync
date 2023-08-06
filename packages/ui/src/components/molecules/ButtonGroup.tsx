import React from 'react';
import styled from 'styled-components';

const ButtonGroupContainer = styled.div`
  display: inline-flex;
  border-radius: 43px;
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
    border-radius: 43px 0 0 43px;
  }

  &:last-child {
    border-right: none;
    border-radius: 0 43px 43px 0;
  }
  width: 56px;
  height: 16px;
  display: flex;
  font-size: 8px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 1px;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export interface ButtonAttributes {
  id: number;
  label: string;
}

interface PillButtonGroupProps {
  buttons: ButtonAttributes[];
  activeButtonId: number;
  onButtonClick: (index: number) => void;
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
        onClick={() => onButtonClick(id)}
      >
        {label}
      </PillButton>
    ))}
  </ButtonGroupContainer>
);
