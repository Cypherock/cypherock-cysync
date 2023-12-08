import React from 'react';

import { LangDisplay, Typography } from '../../atoms';
import { Caption, Slider } from '../Slider';

export interface FeesSliderProps {
  value: number;
  average: number;
  onChange: (newValue: number) => void;
  captions: Caption[];
  overrideDecimal?: number;
  error?: string;
}

export const FeesSlider: React.FC<FeesSliderProps> = ({
  value,
  average,
  onChange,
  captions,
  overrideDecimal,
  error,
}) => {
  const getSliderParams = () => {
    const min = 0;
    const max = average * 2;
    const negativePowerOf10 = Math.min(Math.log10(average), 0);
    const decimal =
      overrideDecimal ?? Math.abs(Math.floor(negativePowerOf10)) + 1;
    return { min, max, decimal };
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
  overrideDecimal: undefined,
  error: undefined,
};
