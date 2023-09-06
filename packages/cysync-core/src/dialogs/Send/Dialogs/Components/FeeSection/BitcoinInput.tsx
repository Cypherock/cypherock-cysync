import {
  Container,
  Flex,
  Tag,
  FeesInput,
  FeesSlider,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';

interface BitcoinInputProps {
  initialValue: number;
  isTextInput: boolean;
  unit: string;
  onChange: (newValue: number) => void;
}
const captions = [
  { id: 1, name: 'Min' },
  { id: 2, name: 'Average' },
  { id: 3, name: 'Max' },
];

export const BitcoinInput: React.FC<BitcoinInputProps> = ({
  initialValue,
  isTextInput,
  unit,
  onChange,
}) => {
  const [value, setValue] = useState(initialValue);
  const handleChange = (val: string | number) => {
    let numberValue = 0;
    if (typeof val === 'string') numberValue = parseFloat(val);
    else numberValue = val;
    setValue(numberValue);
    onChange(numberValue);
  };
  return (
    <>
      {isTextInput && (
        <FeesInput
          value={value.toString()}
          postfixText={unit}
          onChange={handleChange}
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
            onChange={handleChange}
            captions={captions}
          />
        </Container>
      )}
    </>
  );
};
