import React, { FC } from 'react';
import styled from 'styled-components';

import { MutedTextBox } from './MutedTextBox';

import { Container, Image, Typography } from '../../atoms';

export type NameVariants = 'Bitcoin' | 'Ethereum';

interface IconNameBoxProps {
  icon: string;
  title: string;
  subtitle?: string;
  mutedSubtitle?: string;
  mutedBox?: string;
  size?: 'small' | 'big';
}

const IconNameBoxStyle = styled.div<IconNameBoxProps>`
  padding: ${({ size }) =>
    size === 'small' ? '16px 16px 16px 24px' : '16px 20px 16px 40px'};
  width: ${({ size }) => (size === 'small' ? '200px' : '300px')};
  gap: ${({ size }) => (size === 'small' ? '16px' : '24px')};
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const IconNameBox: FC<IconNameBoxProps> = ({ ...props }) => (
  <IconNameBoxStyle {...props}>
    <Image src={props.icon} alt="Asset Icon" />
    <Container direction="column" gap={0} align="flex-start">
      <Typography variant="p" $fontWeight="semibold">
        {props.title}
      </Typography>
      {props.subtitle && (
        <Typography variant="p" $fontWeight="semibold">
          {props.subtitle}
        </Typography>
      )}
      {props.mutedSubtitle && (
        <Container gap={8} display="flex" direction="row">
          <Typography variant="p" $fontSize={12} color="muted">
            {props.mutedSubtitle}
          </Typography>
          {props.mutedBox && props.size === 'big' && (
            <MutedTextBox text={props.mutedBox} />
          )}
        </Container>
      )}
    </Container>
  </IconNameBoxStyle>
);

IconNameBox.defaultProps = {
  size: 'big',
  subtitle: undefined,
  mutedSubtitle: undefined,
  mutedBox: undefined,
};
