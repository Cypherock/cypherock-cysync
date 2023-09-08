import React, { useRef } from 'react';
import styled from 'styled-components';

import { sliderThumbIcon } from '../../assets';
import { Flex, Image, LangDisplay, Typography } from '../atoms';
import { goldenGradient } from '../utils';

export interface Caption {
  id: number;
  name: string;
}

interface SliderProps {
  min?: number;
  max?: number;
  decimal?: number;
  value: number;
  onChange: (value: number) => void;
  captions: Caption[];
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
  decimal = 0,
  value,
  onChange,
  captions,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: MouseEvent) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    let newValue =
      ((event.clientX - containerRect.left) / containerRect.width) *
        (max - min) +
      min;
    newValue = Math.max(Math.min(newValue, max), min);

    onChange(parseFloat(newValue.toFixed(decimal)));
  };

  const handleMouseUp = () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = () => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const progress = Math.max(
    Math.min(((value - min) / (max - min)) * 100, 100),
    0,
  );

  return (
    <>
      <SliderContainer ref={containerRef}>
        <SliderTrack />
        <SliderTrackMask progress={progress} />
        <SliderThumb
          progress={progress}
          onMouseDown={handleMouseDown}
          onDragStart={e => e.preventDefault()}
        >
          <Image src={sliderThumbIcon} alt="Slider Thumb" />
        </SliderThumb>
      </SliderContainer>
      <Flex justify="space-between" width="full">
        {captions.map(caption => (
          <Typography
            key={caption.id}
            variant="span"
            $fontSize={12}
            $fontWeight="medium"
            color="muted"
          >
            <LangDisplay text={caption.name} />
          </Typography>
        ))}
      </Flex>
    </>
  );
};

Slider.defaultProps = {
  min: 0,
  max: 100,
  decimal: 0,
};
