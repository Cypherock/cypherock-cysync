import React from 'react';

import { Button, Container, Typography } from '../../atoms';
import styled from 'styled-components';
import { utils, UtilsProps } from '../../utils';

interface QuestionMarkButtonProps {
  content: string;
  position: 'left' | 'right' | 'top' | 'bottom';
  width?: number;
}

const TooltipContent = styled(Container)<UtilsProps>`
  background: ${({ theme }) => theme.palette.border.popup};
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.text.white};
  width: 200px;

  padding: 4px 8px;
  border-radius: 8px;
  opacity: 1;

  pointer-events: none;
  position: absolute;
  transition: all 0.2s ease-in-out;
  white-space: wrap;
  word-break: keep-all;

  display: flex;
  gap: 8px;

  visibility: hidden;
  opacity: 0;
  transform: scale(80%);

  z-index: 1000;

  ${utils};
`;

const TooltipCard = styled(Container)`
  position: relative;
  :hover + ${TooltipContent} {
    visibility: visible;
    opacity: 1;
    transform: scale(100%);
  }
`;

const positionMap = {
  left: { right: '140%' },
  right: { left: '140%' },
  top: { bottom: '130%' },
  bottom: { top: '130%' },
};

export const QuestionMarkButton: React.FC<QuestionMarkButtonProps> = ({
  content,
  position,
  width,
}) => (
  <TooltipCard>
    <Button
      variant="none"
      color="golden"
      $borderColor="gold"
      $borderRadius={100}
      width={14}
      height={14}
      display="flex"
      justify="center"
      align="center"
    >
      <Typography color="gold" $fontSize={11}>
        ?
      </Typography>
    </Button>
    <TooltipContent {...positionMap[position]} $maxWidth={width}>
      {content}
    </TooltipContent>
  </TooltipCard>
);

QuestionMarkButton.defaultProps = {
  width: 200,
};
