import React, { FC, ReactNode } from 'react';
import { Button, Container, LangDisplay, Typography } from '../../atoms';
import { styled } from 'styled-components';
import { MiniContainer } from './HistoryNameBox';

interface NoDataProps {
  icon: ReactNode;
  text: string;
  subText: string;
  buttonText: string;
}

const MidContainer = styled.div`
  display: flex;
  padding: 16px 20px 16px 40px;
  align-items: center;
  border: none;
  gap: 10px;
  align-self: stretch;
`;

export const TableNoData: FC<NoDataProps> = ({
  icon,
  text,
  subText,
  buttonText,
}) => (
  <Container align="center" direction="column" gap={40}>
    <Container
      align="center"
      direction="row"
      gap={0}
      $bgColor="contentGradient"
    >
      <Container display="flex" px={5} py={2} align="center" gap={24}>
        <MiniContainer variant="success">{icon}</MiniContainer>

        <Container direction="column" gap={8} align="flex-start">
          <Container $bgColor="muted" width={99} height={6} $borderRadius={7} />
          <Container $bgColor="muted" width={52} height={6} $borderRadius={7} />
        </Container>
      </Container>
      <MidContainer>
        <Container $bgColor="muted" width={162} height={6} $borderRadius={7} />
      </MidContainer>
      <MidContainer>
        <Container direction="column" gap={8} align="flex-start">
          <Container $bgColor="muted" width={78} height={6} $borderRadius={7} />
          <Container $bgColor="muted" width={52} height={6} $borderRadius={7} />
        </Container>
      </MidContainer>
    </Container>
    <Container direction="column" gap={16} align="center">
      <Typography $fontWeight="semibold" $fontSize={24}>
        {text}
      </Typography>
      <Typography variant="p" color="muted">
        {subText}
      </Typography>
    </Container>
    <Button variant="primary">
      <LangDisplay text={buttonText} />
    </Button>
  </Container>
);
