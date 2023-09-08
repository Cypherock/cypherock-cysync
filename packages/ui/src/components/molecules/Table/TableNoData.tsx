import React, { FC, ReactNode } from 'react';

import { MiniContainer } from './HistoryNameBox';

import { Button, Container, LangDisplay, Typography } from '../../atoms';

interface NoDataProps {
  icon: ReactNode;
  text: string;
  subText: string;
  buttonText: string;
}

export const TableNoData: FC<NoDataProps> = ({
  icon,
  text,
  subText,
  buttonText,
}) => (
  <Container align="center" direction="column" gap={40} height="90vh">
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
      <Container
        display="flex"
        py={2}
        pl={5}
        pr="20"
        align="center"
        gap={10}
        $alignSelf="stretch"
      >
        <Container $bgColor="muted" width={162} height={6} $borderRadius={7} />
      </Container>
      <Container
        display="flex"
        py={2}
        pl={5}
        pr="20"
        align="center"
        gap={10}
        $alignSelf="stretch"
      >
        <Container direction="column" gap={8} align="flex-end">
          <Container $bgColor="muted" width={78} height={6} $borderRadius={7} />
          <Container $bgColor="muted" width={52} height={6} $borderRadius={7} />
        </Container>
      </Container>
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
