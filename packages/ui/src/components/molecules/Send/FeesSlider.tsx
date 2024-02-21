import React from 'react';

import { LangDisplay, Typography } from '../../atoms';
import { Caption, Slider } from '../Slider';

export interface FeesSliderProps {
  value: string;
  average: string;
  onChange: (newValue: string) => void;
  captions: Caption[];
  overrideDecimal?: number;
  error?: string;
}

export const FeesSlider: React.FC<FeesSliderProps> = ({
  value: valueStr,
  average: averageStr,
  onChange,
  captions,
  overrideDecimal,
  error,
}) => {
  const value = Number(valueStr);
  const average = Number(averageStr);

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
        onChange={val => onChange(val.toString(10))}
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
