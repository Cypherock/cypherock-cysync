import React, { FC } from 'react';
import { Container, Flex, Image, Typography } from '../atoms';
import { arrowGoldenForward } from '../../assets';

export const GoldenArrowList: FC<{
  items: Array<any>;
}> = ({ items }) => (
  <Flex direction="column" gap={8}>
    {items.map((item, index) => (
      <Container
        key={`bullet-list-index-${index + 1}`}
        $alignSelf="start"
        align="center"
        gap={17}
        width="full"
        justify="flex-start"
        $borderRadius={8}
        $bgColor="input"
        $borderColor="input"
        p="12"
      >
        <Image src={arrowGoldenForward} alt="arrowGoldenForward" />
        <Typography variant="h6" color="muted">
          {item}
        </Typography>
      </Container>
    ))}
  </Flex>
);
