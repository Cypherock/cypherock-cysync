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
  left: { right: '110%' },
  right: { left: '110%' },
  top: { bottom: '110%' },
  bottom: { top: '110%' },
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
      width={25}
      height={25}
      display="flex"
      justify="center"
      align="center"
    >
      <Typography variant="h5" color="gold">
        ?
      </Typography>
    </Button>
    <TooltipContent {...positionMap[position]} $width={width}>
      {content}
    </TooltipContent>
  </TooltipCard>
);

QuestionMarkButton.defaultProps = {
  width: undefined,
};
