import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

import { sliderThumbIcon } from '../../assets';
import { Image } from '../atoms';
import { goldenGradient } from '../utils';

interface SliderProps {
  min?: number;
  max?: number;
  initialValue?: number;
  onChange: (value: number) => void;
}

interface SliderTrackProps {
  progress: number;
}

interface SliderThumbProps {
  onMouseDown: () => void;
  progress: number;
}

const SliderContainer = styled.div`
  width: 100%;
  height: 2px;
  border-radius: 2px;
  position: relative;
  background: grey;
`;

const SliderTrack = styled.div`
  position: absolute;
  top: 50%;
  width: 100%;
  height: 2px;
  ${goldenGradient('background')};
  transform: translateY(-50%);
`;

const SliderThumb = styled.div<SliderThumbProps>`
  position: absolute;
  top: 50%;
  left: ${props => props.progress}%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  width: 25px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SliderTrackMask = styled.div<SliderTrackProps>`
  position: absolute;
  top: 50%;
  left: ${({ progress }) => progress}%;
  width: ${({ progress }) => 100 - progress}%;
  height: 2px;
  background: ${({ theme }) => theme.palette.background.slider};
  transform: translateY(-50%);
`;

export const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  initialValue = min,
  onChange,
}) => {
  const [value, setValue] = useState(initialValue);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleMouseMove = (event: MouseEvent) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    let newValue =
      ((event.clientX - containerRect.left) / containerRect.width) *
        (max - min) +
      min;
    newValue = Math.max(Math.min(newValue, max), min);

    setValue(newValue);
    onChange(Math.round(newValue));
  };

  const handleMouseUp = () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = () => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <SliderContainer ref={containerRef}>
      <SliderTrack />
      <SliderTrackMask progress={((value - min) / (max - min)) * 100} />
      <SliderThumb
        progress={((value - min) / (max - min)) * 100}
        onMouseDown={handleMouseDown}
        onDragStart={e => e.preventDefault()}
      >
        <Image src={sliderThumbIcon} alt="Slider Thumb" />
      </SliderThumb>
    </SliderContainer>
  );
};

Slider.defaultProps = {
  min: 0,
  max: 100,
  initialValue: 0,
};
