import React, { ReactElement } from 'react';
import { styled } from 'styled-components';
import { theme } from '../../themes/theme.styled';
import { Flex, Image } from '../atoms';
import { block, blockSelected } from '../../assets/images';

interface IMilestoneProps {
  currentState: number;
  totalState: number;
  blockSize?: number;
}

const Line = styled.div<{ bg: string }>`
  width: 12px;
  height: 1px;
  background: ${props => props.bg};

  @media ${theme.screens.lg} {
    width: 24px;
  }
`;

export const Milestone = (props: IMilestoneProps): ReactElement => {
  const { currentState, totalState, blockSize } = props;
  const selectedBlocks = Array(currentState)
    .fill(0)
    .map((_, i) => (
      <React.Fragment key={`test1-${i + 1}`}>
        <Image src={blockSelected} alt="device" width={blockSize} />
        {i === currentState - 1 || <Line bg={theme.palette.golden} />}
      </React.Fragment>
    ));
  const unSelectedBlocks = Array(Math.max(totalState - currentState, 0))
    .fill(0)
    .map((_, i) => (
      <React.Fragment key={`test2-${i + 1}`}>
        {i === totalState - currentState + 1 || (
          <Line bg={theme.palette.text.muted} />
        )}
        <Image src={block} alt="device" width={blockSize} />
      </React.Fragment>
    ));

  return (
    <Flex justify="center" align="center">
      {selectedBlocks} {unSelectedBlocks}
    </Flex>
  );
};

Milestone.defaultProps = {
  blockSize: 13.27,
};
