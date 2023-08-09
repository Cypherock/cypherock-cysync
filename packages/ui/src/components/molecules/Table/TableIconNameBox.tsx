import React, { FC } from 'react';
import styled from 'styled-components';

import { TableMutedTextBox } from './TableMutedTextBox';

import { Container, Image, Typography } from '../../atoms';

interface IconNameBoxProps {
  icon: string;
  title: string;
  subtitle?: string;
  mutedSubtitle?: string;
  mutedBox?: string;
}

const IconNameBoxStyle = styled.div<IconNameBoxProps>`
  padding: 16px 16px 16px 24px;
  width: 200px;
  gap: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;

  @media ${({ theme }) => theme.screens.lg} {
    padding: 16px 20px 16px 40px;
    width: 300px;
    gap: 24px;
  }
`;

export const TableIconNameBox: FC<IconNameBoxProps> = ({ ...props }) => (
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
          {props.mutedBox && <TableMutedTextBox text={props.mutedBox} />}
        </Container>
      )}
    </Container>
  </IconNameBoxStyle>
);

TableIconNameBox.defaultProps = {
  subtitle: undefined,
  mutedSubtitle: undefined,
  mutedBox: undefined,
};
