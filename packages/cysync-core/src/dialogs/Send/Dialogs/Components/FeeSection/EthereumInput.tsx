import {
  Container,
  Flex,
  Typography,
  LangDisplay,
  Tag,
  GoldQuestionMark,
  Caption,
  FeesSlider,
  FeesInput,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';

interface EthereumInputProps {
  initialGasPrice: number;
  initialGasLimit: number;
  isTextInput: boolean;
  unit: string;
  onChange: (newValue: number) => void;
  onGasLimitChange: (newValue: number) => void;
  captions: Caption[];
  priceLabel: string;
  limitLabel: string;
}

export const EthereumInput: React.FC<EthereumInputProps> = ({
  initialGasPrice,
  initialGasLimit,
  isTextInput,
  unit,
  onChange,
  onGasLimitChange,
  captions,
  priceLabel,
  limitLabel,
}) => {
  const [gasPrice, setGasPrice] = useState(initialGasPrice);
  const [gasLimit, setGasLimit] = useState(initialGasLimit);

  const handlePriceChange = (val: string | number) => {
    let numberValue = 0;
    if (typeof val === 'string') numberValue = parseFloat(val);
    else numberValue = val;
    setGasPrice(numberValue);
    onChange(numberValue);
  };

  const handleLimitChange = (val: string | number) => {
    let numberValue = 0;
    if (typeof val === 'string') numberValue = parseFloat(val);
    else numberValue = val;
    setGasLimit(numberValue);
    onGasLimitChange(numberValue);
  };

  return (
    <>
      <Container display="flex" direction="column" gap={16} width="full">
        {!isTextInput && (
          <>
            <Flex justify="space-between" align="center" width="full">
              <Flex align="center" gap={8}>
                <Typography
                  variant="span"
                  width="100%"
                  color="muted"
                  $fontSize={13}
                >
                  <LangDisplay text={priceLabel} />
                </Typography>
                <GoldQuestionMark height={14} width={14} />
              </Flex>

              <Flex align="flex-end" direction="row" gap={8} ml="auto">
                <Tag type="info">
                  {gasPrice} {unit}
                </Tag>
              </Flex>
            </Flex>

            <FeesSlider
              value={gasPrice}
              onChange={handlePriceChange}
              captions={captions}
              average={initialGasPrice}
            />
          </>
        )}
      </Container>
      {isTextInput && (
        <>
          <FeesInput
            value={gasPrice.toString()}
            postfixText={unit}
            onChange={handlePriceChange}
          />

          <Container display="flex" direction="column" gap={8} width="full">
            <Flex justify="space-between" align="center" width="full">
              <Flex align="center" gap={8}>
                <Typography
                  variant="span"
                  width="100%"
                  color="muted"
                  $fontSize={13}
                >
                  <LangDisplay text={limitLabel} />
                </Typography>
                <GoldQuestionMark height={14} width={14} />
              </Flex>
            </Flex>
            <FeesInput
              value={gasLimit.toString()}
              onChange={handleLimitChange}
            />
          </Container>
        </>
      )}
    </>
  );
};
