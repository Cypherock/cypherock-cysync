import React from 'react';
import styled from 'styled-components';

import { ArrowDown, ArrowUp } from '../../assets';
import { Typography } from '../atoms';

const StyledAccordion = styled.div`
  display: flex;
  padding: 8px 0px 16px 0px;
  justify-content: center;
  align-items: center;
  gap: 24px;
  align-self: stretch;
  border-bottom: 1px solid ${({ theme }) => theme.palette.border.table.row};
  background: ${({ theme }) => theme.palette.background.content};
  cursor: pointer;
  transition: all 0.3s ease-in-out;
`;

interface AccordionProps {
  tokensLength: number;
  isOpen: boolean;
  toggleAccordion: () => void;
  $show?: string;
  $hide?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  tokensLength,
  isOpen,
  toggleAccordion,
  $show,
  $hide,
}) => (
  <StyledAccordion onClick={toggleAccordion}>
    <Typography color="white" $fontSize={14} $fontWeight="medium">
      {isOpen ? $hide : `${$show} (${tokensLength})`}
    </Typography>
    {isOpen ? <ArrowUp /> : <ArrowDown />}
  </StyledAccordion>
);

Accordion.defaultProps = {
  $show: '',
  $hide: '',
};
