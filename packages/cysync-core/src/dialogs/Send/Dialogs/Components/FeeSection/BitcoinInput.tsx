import {
  Container,
  Flex,
  Tag,
  FeesInput,
  FeesSlider,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

interface BitcoinInputProps {
  initialValue: number;
  isTextInput: boolean;
  unit: string;
  onChange: (newValue: number) => void;
}

export const BitcoinInput: React.FC<BitcoinInputProps> = ({
  initialValue,
  isTextInput,
  unit,
  onChange,
}) => {
  const lang = useAppSelector(selectLanguage);
  const captions = lang.strings.send.fees.sliderLabels;
  const [value, setValue] = useState(initialValue);

  const handleChange = (val: number) => {
    setValue(val);
    onChange(val);
  };

  return (
    <>
      {isTextInput && (
        <FeesInput
          value={value.toString()}
          postfixText={unit}
          onChange={handleChange}
          valueType="integer"
        />
      )}
      {!isTextInput && (
        <Container display="flex" direction="column" gap={16} width="full">
          <Flex justify="space-between" align="center" width="full">
            <Flex align="flex-end" direction="row" gap={8} ml="auto">
              <Tag type="info">
                {value} {unit}
              </Tag>
            </Flex>
          </Flex>

          <FeesSlider
            value={value}
            average={initialValue}
            onChange={handleChange}
            overrideDecimal={0}
            captions={captions}
          />
        </Container>
      )}
    </>
  );
};
