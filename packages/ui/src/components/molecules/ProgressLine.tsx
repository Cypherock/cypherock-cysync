import React, { FC } from 'react';

import { Container, Flex } from '../atoms';

const bgColor = (activeTab: number, index: number, hasNoStart?: boolean) => {
  if (index > activeTab) return 'muted';
  if (index < activeTab) return 'golden';
  if (activeTab === 0 && hasNoStart) return 'muted';
  return 'white';
};

export const ProgressLine: FC<{
  index: number;
  length: number;
  activeTab: number;
  skipped?: number[];
  hasNoStart?: boolean;
}> = ({ index, length, activeTab, skipped, hasNoStart }) => {
  if (hasNoStart && activeTab === 0) {
    return (
      <Flex height={60} align="flex-start" mt={7}>
        <Container
          $bgColor={bgColor(activeTab, index, hasNoStart)}
          width={16}
          height={1.5}
        />
      </Flex>
    );
  }
  return (
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
};

ProgressLine.defaultProps = {
  skipped: [],
  hasNoStart: false,
};
