import React from 'react';
import { styled } from 'styled-components';

import { Flex, Indicator, LangDisplay, Typography } from '../atoms';

interface CardTapItemProps {
  text: string;
  currentState: number;
  totalState: number;
  currentFailed?: boolean;
}

interface CardTapListProps {
  items: CardTapItemProps[];
}

const getBgColor = (currentState: number, totalState: number) => {
  if (currentState < 0) return 'inputSecondary';
  if (currentState < totalState) return 'gold';
  return 'successSecondary';
};

const getTextColor = (currentState: number, totalState: number) => {
  if (currentState < 0) return 'muted';
  if (currentState < totalState) return 'gold';
  return 'success';
};
const getIndicatorState = (
  iterator: number,
  currentState: number,
  error?: boolean,
) => {
  if (iterator < currentState) return 'success';
  if (iterator === currentState) return error ? 'failed' : 'focused';
  return 'disabled';
};

const BackgroundStyle = styled.div<{ $bgColor: string }>`
  background: ${({ theme, $bgColor }) => theme.palette.background[$bgColor]};
  border-radius: 8px;
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const MaskStyle = styled.div`
  background: ${({ theme }) => theme.palette.background.input};
  border-radius: 8px;
  width: calc(100% - 2px);
  height: calc(100% - 2px);
  padding: 8px 16px;
  gap: 16px;
  display: flex;
  justify-content: center;
  position: relative;
  align-items: center;
`;

const CardTapListItem: React.FC<CardTapItemProps> = ({
  text,
  currentState,
  totalState,
  currentFailed,
}) => {
  const indicators = Array(totalState)
    .fill(0)
    .map((_, i) => (
      <Indicator
        key={`indicator-${i + 1}`}
        size={12}
        state={getIndicatorState(i, currentState, currentFailed)}
      />
    ));

  return (
    <BackgroundStyle $bgColor={getBgColor(currentState, totalState)}>
      <MaskStyle>
        <Typography
          variant="h6"
          color={getTextColor(currentState, totalState)}
          $fontWeight="medium"
          grow={1}
        >
          <LangDisplay text={text} />
        </Typography>

        {indicators}
      </MaskStyle>
    </BackgroundStyle>
  );
};

CardTapListItem.defaultProps = {
  currentFailed: false,
};
export const CardTapList: React.FC<CardTapListProps> = ({ items }) => (
  <Flex direction="column" gap={8} width="full">
    {items.map(({ text, currentState, totalState, currentFailed }, i) => (
      <CardTapListItem
        key={`card-tap-list-item-${i + 1}`}
        text={text}
        currentState={currentState}
        totalState={totalState}
        currentFailed={currentFailed}
      />
    ))}
  </Flex>
);
