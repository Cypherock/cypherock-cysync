import React from 'react';

import { LangDisplay, Typography } from '../../atoms';
import { Caption, Slider } from '../Slider';

export interface FeesSliderProps {
  value: number;
  average: number;
  onChange: (newValue: number) => void;
  captions: Caption[];
  error?: string;
}

export const FeesSlider: React.FC<FeesSliderProps> = ({
  value,
  average,
  onChange,
  captions,
  error,
}) => {
  const getSliderParams = () => {
    const min = 0;
    const max = average * 2;
    return { min, max };
  };
  return (
    <>
      <Slider
        value={value}
        captions={captions}
        onChange={onChange}
        {...getSliderParams()}
      />
      {error && (
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
};

FeesSlider.defaultProps = {
  error: undefined,
};
