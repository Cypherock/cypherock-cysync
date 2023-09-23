import React from 'react';
import styled from 'styled-components';

import { ArrowUp, ArrowDown } from '../../../../assets';
import { Typography } from '../../../atoms';
import { UtilsProps, utils } from '../../../utils';

const StyledButton = styled.button<
  { $rowIndex: number; $isLast?: boolean } & UtilsProps
>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 8px 0px 16px 0px;
  border: none;
  background: ${({ theme, $rowIndex }) =>
    $rowIndex % 2 !== 0
      ? theme.palette.background.stripe
      : theme.palette.background.content};
  cursor: pointer;
  transition: background 0.3s ease-in-out;
  text-align: left;
  gap: 24px;

  &:focus {
    outline: none;
    background: ${({ theme }) => theme.palette.background.contentFocused};
  }

  border-bottom: 1px solid
    ${({ theme, $rowIndex }) =>
      $rowIndex % 2 !== 0
        ? theme.palette.border.table.stripe
        : theme.palette.border.table.row};
  ${({ $isLast }) => $isLast && `border-radius: 0 0 24px 24px`};

  ${utils}
`;

interface AccordionProps {
  tokensLength: number;
  isOpen: boolean;
  toggleAccordion: () => void;
  $show?: string;
  $hide?: string;
  $rowIndex: number;
  $isLast?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  tokensLength,
  isOpen,
  toggleAccordion,
  $show,
  $hide,
  $rowIndex,
  $isLast,
}) => (
  <StyledButton
    $rowIndex={$rowIndex}
    $isLast={$isLast}
    onClick={toggleAccordion}
  >
    <Typography color="white" $fontSize={14} $fontWeight="medium">
      {isOpen ? $hide : `${$show} (${tokensLength})`}
    </Typography>
    {isOpen ? <ArrowUp /> : <ArrowDown />}
  </StyledButton>
);

Accordion.defaultProps = {
  $show: '',
  $hide: '',
  $isLast: undefined,
};
