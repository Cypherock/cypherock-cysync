import React, { FC } from 'react';
import styled from 'styled-components';

import { Flex } from './Flex';
import { Typography, TypographyColor } from './Typography';

import { WidthProps } from '../utils';

export type NomineeMessageVariant = 'danger';

export interface NomineeMessageProps extends WidthProps {
  label: string;
  value?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  variant?: NomineeMessageVariant;
  withBackground?: boolean;
  isHeader?: boolean;
}

const StyledNomineeMessage = styled.div<{ $withBackground: boolean }>`
  display: flex;
  min-width: 624px;
  padding: 8px 16px;
  justify-content: space-between;
  align-items: center;
  background: ${({ $withBackground, theme }) =>
    $withBackground ? theme.palette.background.slate : 'none'};
  border-radius: 8px;
`;

const variantColorMap: Record<NomineeMessageVariant, TypographyColor> = {
  danger: 'error',
};

export const NomineeMessage: FC<NomineeMessageProps> = ({
  label,
  value,
  leading,
  trailing,
  variant,
  withBackground,
  isHeader: withHeaderFont,
}) => (
  <StyledNomineeMessage $withBackground={withBackground ?? false}>
    <Flex gap={16} align="center">
      {leading}
      <Typography
        color={(variant && variantColorMap[variant]) ?? 'muted'}
        {...(withHeaderFont
          ? { $fontSize: 18, $fontWeight: 'medium', $letterSpacing: '0.9px' }
          : {})}
      >
        {label}
      </Typography>
    </Flex>
    <Flex gap={16} align="center">
      <Typography color={(variant && variantColorMap[variant]) ?? 'white'}>
        {value}
      </Typography>
      {trailing}
    </Flex>
  </StyledNomineeMessage>
);

NomineeMessage.defaultProps = {
  value: undefined,
  leading: undefined,
  trailing: undefined,
  variant: undefined,
  withBackground: undefined,
  isHeader: undefined,
};
