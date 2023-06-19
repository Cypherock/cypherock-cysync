import React from 'react';
import { Container, Flex, Indicator, LangDisplay, Typography } from '../atoms';

interface CardTapItemProps {
  text: string;
  currentState: number;
  totalState: number;
  currentFailed?: boolean;
}

interface CardTapListProps {
  items: CardTapItemProps[];
}

const getIndicatorState = (
  iterator: number,
  currentState: number,
  error?: boolean,
) => {
  if (iterator < currentState) return 'success';
  if (iterator === currentState) return error ? 'failed' : 'focused';
  return 'disabled';
};

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
    <Container
      $bgColor="input"
      width="full"
      rounded={8}
      display="flex"
      px={2}
      py={1}
      gap={16}
    >
      <Typography variant="h6" color="muted" $fontWeight="medium" grow={1}>
        <LangDisplay text={text} />
      </Typography>

      {indicators}
    </Container>
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
