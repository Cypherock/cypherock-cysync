import React, { ReactElement } from 'react';
import { styled } from 'styled-components';

import { blockIcon, blockSelectedIcon } from '../../assets/images';
import { theme } from '../../themes/theme.styled';
import { Flex, Image } from '../atoms';

interface MilestoneProps {
  currentState: number;
  totalState: number;
  blockSize?: number;
}

const Line = styled.div<{ bg: string }>`
  width: 12px;
  height: 1px;
  background: ${props => props.bg};

  @media ${theme.screens.lg} and ${theme.screensHeight.lg} {
    width: 24px;
  }
`;

export const Milestone = (props: MilestoneProps): ReactElement => {
  const { currentState, totalState, blockSize } = props;
  const selectedBlocks = Array(currentState)
    .fill(0)
    .map((_, i) => (
      <React.Fragment key={`selected-${i + 1}`}>
        <Image src={blockSelectedIcon} alt="device" $width={blockSize} />
        {i === currentState - 1 || <Line bg={theme.palette.golden} />}
      </React.Fragment>
    ));
  const unSelectedBlocks = Array(Math.max(totalState - currentState, 0))
    .fill(0)
    .map((_, i) => (
      <React.Fragment key={`unselected-${i + 1}`}>
        {i === totalState - currentState + 1 || (
          <Line bg={theme.palette.text.muted} />
        )}
        <Image src={blockIcon} alt="device" $width={blockSize} />
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
