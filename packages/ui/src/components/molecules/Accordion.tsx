import React from 'react';
import styled from 'styled-components';

import { ArrowDown, ArrowUp } from '../../assets';
import { Typography } from '../atoms';

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 8px 0px 16px 0px;
  border: none;
  background: ${({ theme }) => theme.palette.background.content};
  cursor: pointer;
  transition: background 0.3s ease-in-out;
  text-align: left;
  gap: 24px;

  &:focus {
    outline: none;
    background: ${({ theme }) => theme.palette.background.contentFocused};
  }
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
  <StyledButton onClick={toggleAccordion}>
    <Typography color="white" $fontSize={14} $fontWeight="medium">
      {isOpen ? $hide : `${$show} (${tokensLength})`}
    </Typography>
    {isOpen ? <ArrowUp /> : <ArrowDown />}
  </StyledButton>
);

Accordion.defaultProps = {
  $show: '',
  $hide: '',
};

export default Accordion;
