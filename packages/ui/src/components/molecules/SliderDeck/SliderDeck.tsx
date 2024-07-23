import React, { FC, useState } from 'react';
import { styled } from 'styled-components';

import { SliderStop } from './SliderStop';

import { colors } from '../../../themes/color.styled';

const SliderContainer = styled.div`
  position: relative;
  width: 628px;
  padding: var(--Subscription-Years, 1px) 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
`;

const LineSegment = styled.div<{ isActive: boolean }>`
  position: absolute;
  height: 4px;
  background-color: ${({ isActive }) =>
    isActive ? colors.background.gold : colors.background.separator};
`;

const StopContainer = styled.div<{ left: string }>`
  position: absolute;
  top: -25px;
  left: ${({ left }) => left};
`;
const TextContainer = styled.div`
  margin-top: 8px;
  color: ${colors.background.gold};
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  text-align: center;
  width: 45px;
  position: absolute;
  top: 50px;
`;
interface SliderProps {
  selectedYear: number;
}

export const SliderDeck: FC<SliderProps> = ({
  selectedYear: initialSelectedYear,
}) => {
  const [selectedYear, setSelectedYear] = useState(initialSelectedYear);

  const stops = [
    { label: '1 Year', isActive: selectedYear >= 1 },
    { label: '2 Years', isActive: selectedYear >= 2 },
    { label: '3 Years', isActive: selectedYear >= 3 },
    { label: '4 Years', isActive: selectedYear >= 4 },
    { label: '5 Years', isActive: selectedYear >= 5 },
  ];

  const stopPositions = ['0%', '25%', '50%', '75%', '100%'];

  return (
    <SliderContainer>
      {stopPositions.map((_, index) => (
        <LineSegment
          key={`segment-${index - 1}`}
          isActive={selectedYear > index + 1}
          style={{
            left: stopPositions[index],
            width:
              index < stopPositions.length - 1
                ? `calc(${stopPositions[index + 1]} - ${stopPositions[index]})`
                : '0%',
          }}
        />
      ))}
      {stops.map((stop, index) => (
        <StopContainer
          key={`${index + 1}`}
          left={index === 0 ? 'calc(0% - 3px)' : stopPositions[index]}
        >
          <SliderStop
            Label={stop.label}
            isActive={stop.isActive}
            onClick={() => setSelectedYear(index + 1)}
          />{' '}
          {stop.isActive && <TextContainer>{stop.label}</TextContainer>}
        </StopContainer>
      ))}
    </SliderContainer>
  );
};
