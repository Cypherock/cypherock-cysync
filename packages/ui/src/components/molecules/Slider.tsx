import React from 'react';
import styled from 'styled-components';

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}
const SliderContainer = styled.div`
  width: 100%;
`;
const SliderInput = styled.input<{ min: number; value: number; max: number }>`
  width: 100%;
  -webkit-appearance: none;
  background: grey;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 26px; // Increase the height and width to account for padding and border
    width: 26px;
    border-radius: 50%;
    background: ${({ theme }) => theme.palette.golden};
    box-sizing: border-box;
    border: 12px solid red; // Black border of 2px
    padding: 5px; // Padding of 5px to create the gap
    cursor: pointer;
    margin-top: -13px; // Adjusted to center the thumb
    position: relative;
    z-index: 2;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 2px; /* Reduce this to adjust the thickness of the track */
    cursor: pointer;
    background: linear-gradient(
      to right,
      #ffd700 0%,
      #ffd700
        ${props => ((props.value - props.min) / (props.max - props.min)) * 100}%,
      transparent
        ${props => ((props.value - props.min) / (props.max - props.min)) * 100}%,
      transparent 100%
    );
    border-radius: 2px; /* Add a slight border radius to give a rounded effect */
  }
  &:focus {
    outline: none;
  }
`;

export const Slider: React.FC<SliderProps> = ({
  min,
  max,
  value,
  onChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    onChange(newValue);
  };
  return (
    <SliderContainer>
      <SliderInput
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
      />
    </SliderContainer>
  );
};
