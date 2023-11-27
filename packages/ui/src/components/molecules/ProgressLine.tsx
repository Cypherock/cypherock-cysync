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
  skipped?: number[];
}> = ({ index, length, activeTab, skipped }) => (
  <Flex height={60} align={index === length - 1 ? 'flex-start' : 'flex-end'}>
    <Flex
      direction={index === 0 || index >= length ? 'row' : 'column'}
      align={index === length ? 'flex-end' : 'flex-start'}
    >
      <Container
        $bgColor={bgColor(activeTab, index)}
        width={1.5}
        height={30.5}
      />
      {skipped?.includes(index) && activeTab > index ? (
        <Container
          $bgColor={bgColor(activeTab, index)}
          width={1.5}
          height={1.5}
          mr="14.5px"
        />
      ) : (
        <Container
          $bgColor={bgColor(activeTab, index)}
          width={16}
          height={1.5}
        />
      )}
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

ProgressLine.defaultProps = {
  skipped: [],
};
