import React from 'react';
import { LangDisplay, Typography } from '../../atoms';
import { Caption, Slider } from '../Slider';

export interface FeesSliderProps {
  value: number;
  onChange: (newValue: number) => void;
  captions: Caption[];
  error: string;
}

export const FeesSlider: React.FC<FeesSliderProps> = ({
  value,
  onChange,
  captions,
  error,
}) => (
  <>
    <Slider value={value} captions={captions} onChange={onChange} />
    {!error && (
      <Typography
        variant="span"
        width="100%"
        color="error"
        $alignSelf="start"
        $fontSize={12}
      >
        <LangDisplay text={error} />
      </Typography>
    )}
  </>
);
