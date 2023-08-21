import {
  Container,
  Flex,
  Tag,
  Caption,
  FeesInput,
  FeesSlider,
} from '@cypherock/cysync-ui';
import React from 'react';

interface BitcoinInputProps {
  type: 'slider' | 'input';
  message: string;
  inputPostfix: string;
  value: number;
  onChange: (newValue: number) => void;
  captions: Caption[];
  error: string;
}

export const BitcoinInput: React.FC<BitcoinInputProps> = ({
  type,
  message,
  inputPostfix,
  value,
  onChange,
  captions,
  error,
}) => (
  <>
    <Container display="flex" direction="column" gap={16} width="full">
      <Flex justify="space-between" align="center" width="full">
        {type === 'slider' && (
          <Flex align="flex-end" direction="row" gap={8} ml="auto">
            <Tag type="info">
              {value}
              {message}
            </Tag>
          </Flex>
        )}
      </Flex>

      {type === 'slider' && (
        <FeesSlider
          value={value}
          onChange={onChange}
          captions={captions}
          error={error}
        />
      )}
    </Container>
    {type === 'input' && (
      <FeesInput value={value.toString()} postfixText={inputPostfix} />
    )}
  </>
);
