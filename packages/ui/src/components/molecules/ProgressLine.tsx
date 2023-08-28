import React, { FC } from 'react';

import { Container, Flex } from '../atoms';

const bgColor = (activeTab: number, index: number) => {
  if (index > activeTab) return 'muted';
  if (index < activeTab) return 'golden';
  return 'white';
};

export const ProgressLine: FC<{
  index: number;
  length: number;
  activeTab: number;
}> = ({ index, length, activeTab }) => (
  <Flex height={60} align={index === length - 1 ? 'flex-start' : 'flex-end'}>
    <Flex
      direction={!(index === 0 || index >= length) ? 'column' : 'row'}
      align={index === length ? 'flex-end' : 'flex-start'}
    >
      <Container
        $bgColor={bgColor(activeTab, index)}
        width={1.5}
        height={30.5}
      />
      <Container $bgColor={bgColor(activeTab, index)} width={16} height={1.5} />
      {index !== 0 && index !== length - 1 && (
        <Container
          $bgColor={bgColor(activeTab, index)}
          width={1.5}
          height={30.5}
        />
      )}
    </Flex>
  </Flex>
);
