import React, { FC } from 'react';

import { Container, Flex, Typography } from '../atoms';

export interface TimerProps {
  minutes: string;
  seconds: string;
  title: string;
  minutesLabel: string;
  secondsLabel: string;
}

export const Timer: FC<TimerProps> = ({
  minutes,
  seconds,
  title,
  minutesLabel,
  secondsLabel,
}) => (
  <Container mt="auto">
    <Container
      display="flex"
      direction="column"
      width="210px"
      p={2}
      gap={12}
      $bgColor="input"
      $borderRadius={8}
    >
      <Typography variant="p" color="muted">
        {title}
      </Typography>
      <Flex gap={21}>
        <Flex direction="column" align="center">
          <Typography variant="h4">{minutes}</Typography>
          <Typography variant="p" $fontSize={14} color="muted">
            {minutesLabel}
          </Typography>
        </Flex>
        <Typography variant="h2">:</Typography>
        <Flex direction="column" align="center">
          <Typography variant="h4">{seconds}</Typography>
          <Typography variant="p" $fontSize={14} color="muted">
            {secondsLabel}
          </Typography>
        </Flex>
      </Flex>
    </Container>
  </Container>
);
