import React, { FC } from 'react';
import styled from 'styled-components';

import { Button } from './Button';
import { Flex } from './Flex';
import { Typography } from './Typography';

import { WidthProps, width } from '../utils';

export interface NomineeMessageProps extends WidthProps {
  text: string;
  icon: React.ReactNode;
  actionText: string;
  onAction: () => void;
}

const StyledNomineeMessage = styled.div`
  display: flex;
  width: 624px;
  padding: 8px 16px;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.palette.background.slate};
  border-radius: 8px;

  ${width}
`;

export const NomineeMessage: FC<NomineeMessageProps> = ({
  text,
  icon,
  onAction,
  actionText,
  ...props
}) => (
  <StyledNomineeMessage {...props}>
    <Flex align="center" gap={16} shrink={0}>
      {icon}
      <Typography $fontSize={16} color="muted">
        {text}
      </Typography>
    </Flex>
    <Button onClick={onAction} variant="text">
      <Typography $fontSize={14} $fontWeight="medium" color="gold">
        {actionText}
      </Typography>
    </Button>
  </StyledNomineeMessage>
);
