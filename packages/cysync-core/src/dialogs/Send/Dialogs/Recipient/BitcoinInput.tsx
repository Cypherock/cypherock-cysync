import React from 'react';
import {
  Container,
  Flex,
  Tag,
  Caption,
  FeesInput,
  FeesSlider,
} from '@cypherock/cysync-ui';

interface BitcoinInputProps {
  type: 'slider' | 'input';
  message: string;
  inputValue: string;
  inputPostfix: string;
  value: number;
  onChange: (newValue: number) => void;
  captions: Caption[];
  error: string;
}

export const BitcoinInput: React.FC<BitcoinInputProps> = ({
  type,
  message,
  inputValue,
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
            <Tag type="info">{message}</Tag>
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
      <FeesInput value={inputValue} postfixText={inputPostfix} />
    )}
  </>
);
