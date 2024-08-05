import React, { FC } from 'react';
import styled from 'styled-components';

import { Button } from './Button';
import { Divider } from './Divider';
import { Flex } from './Flex';
import { Typography } from './Typography';

import { WidthProps } from '../utils';

export interface NomineeMessageProps extends WidthProps {
  text: string;
  icon?: React.ReactNode;
  actionText?: string;
  secondaryActionText?: string;
  value?: string;
  isEditable?: boolean;
  onAction?: () => void;
  linearGradient?: string;
  customStyles?: React.CSSProperties;
  showEditBelow?: boolean;
  showFullCard?: boolean;
}

const StyledNomineeMessage = styled.div<NomineeMessageProps>`
  display: flex;
  width: 624px;
  padding: 8px 16px;
  justify-content: space-between;
  align-items: center;
  background: ${({ linearGradient, theme }) =>
    linearGradient ?? theme.palette.background.separatorSecondary};
  border-radius: 8px;
  ${({ customStyles }) => customStyles && { ...customStyles }}
`;

export const NomineeMessage: FC<NomineeMessageProps> = ({
  text,
  icon,
  actionText,
  secondaryActionText,
  value,
  isEditable,
  showEditBelow,
  onAction,
  linearGradient,
  customStyles,
  showFullCard,
  ...props
}) => (
  <StyledNomineeMessage
    {...props}
    text={text}
    linearGradient={linearGradient}
    customStyles={customStyles}
  >
    <Flex
      direction={showFullCard ? 'column' : 'row'}
      justify={showFullCard ? 'flex-start' : 'space-between'}
      width="100%"
    >
      <Flex
        justify="space-between"
        width="100%"
        p={showFullCard ? '16px 0px' : '0'}
      >
        <Flex align="center" gap={16} shrink={0}>
          {icon && icon}
          <Typography $fontSize={16} color="muted">
            {text}
          </Typography>
        </Flex>
        {!showEditBelow && isEditable && actionText && (
          <Button onClick={onAction} variant="text">
            <Typography $fontSize={14} $fontWeight="medium" color="gold">
              {actionText}
            </Typography>
          </Button>
        )}
      </Flex>
      {showFullCard && (
        <Divider
          mb={2}
          variant="horizontal"
          background="#39322C"
          height="2px"
        />
      )}
      {value && (
        <Flex justify="flex-end" width="100%">
          <Typography $fontSize={16} color="muted">
            {value}
          </Typography>
          {showEditBelow && isEditable && secondaryActionText && (
            <Button onClick={onAction} variant="text" ml={2}>
              <Typography $fontSize={14} $fontWeight="medium" color="gold">
                {secondaryActionText}
              </Typography>
            </Button>
          )}
        </Flex>
      )}
    </Flex>
  </StyledNomineeMessage>
);

NomineeMessage.defaultProps = {
  icon: null,
  actionText: '',
  secondaryActionText: '',
  value: '',
  isEditable: false,
  onAction: undefined,
  linearGradient: '',
  customStyles: {},
  showEditBelow: false,
  showFullCard: false,
};
