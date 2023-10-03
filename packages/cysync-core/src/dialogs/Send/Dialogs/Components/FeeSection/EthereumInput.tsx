import { IPreparedEvmTransaction } from '@cypherock/coin-support-evm';
import {
  Container,
  Flex,
  Typography,
  LangDisplay,
  Tag,
  GoldQuestionMark,
  FeesSlider,
  FeesInput,
} from '@cypherock/cysync-ui';
import React, { useEffect, useState } from 'react';

import { useSendDialog } from '~/dialogs/Send/context';
import { selectLanguage, useAppSelector } from '~/store';

interface EthereumInputProps {
  initialGasPrice: number;
  inputGasPrice: number;
  isTextInput: boolean;
  unit: string;
  onChange: (param: { gasLimit?: number; gasPrice?: number }) => void;
}

export const EthereumInput: React.FC<EthereumInputProps> = ({
  initialGasPrice,
  inputGasPrice,
  isTextInput,
  unit,
  onChange,
}) => {
  const [gasPrice, setGasPrice] = useState(inputGasPrice);
  const lang = useAppSelector(selectLanguage);
  const captions = lang.strings.send.fees.sliderLabels;
  const { inputLabels } = lang.strings.send.fees;
  const transaction = useSendDialog().transaction as IPreparedEvmTransaction;

  const handlePriceChange = (val: string | number) => {
    let numberValue = 0;
    if (typeof val === 'string') numberValue = parseFloat(val);
    else numberValue = val;
    setGasPrice(numberValue);
    // on change gas price, prepare EVM fee
    onChange({ gasPrice: numberValue });
  };

  const handleLimitChange = (val: string | number) => {
    let numberValue = 0;
    if (typeof val === 'string') numberValue = parseFloat(val);
    else numberValue = val;
    // on change gas limit, prepare EVM fee
    onChange({ gasLimit: numberValue });
  };

  useEffect(() => {
    setGasPrice(initialGasPrice);
    transaction.userInputs.gasPrice = transaction.staticData.averageGasPrice;
    transaction.userInputs.gasLimit = transaction.computedData.gasLimitEstimate;
    onChange({
      gasLimit: Number(transaction.computedData.gasLimitEstimate),
      gasPrice: initialGasPrice,
    });
  }, [isTextInput, transaction.computedData.gasLimitEstimate]);

  return (
    <>
      <Container display="flex" direction="column" gap={16} width="full">
        {!isTextInput && (
          <>
            <Flex justify="space-between" align="center" width="full">
              <Flex align="center" gap={8}>
                <Typography variant="span" color="muted" $fontSize={13}>
                  <LangDisplay text={inputLabels.gasPrice} />
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
          <Container display="flex" direction="column" gap={8} width="full">
            <Flex justify="space-between" align="center" width="full">
              <Flex align="center" gap={8}>
                <Typography variant="span" color="muted" $fontSize={13}>
                  <LangDisplay text={inputLabels.gasPrice} />
                </Typography>
                <GoldQuestionMark height={14} width={14} />
              </Flex>
            </Flex>
            <FeesInput
              value={initialGasPrice.toString()}
              postfixText={unit}
              onChange={handlePriceChange}
            />
          </Container>

          <Container display="flex" direction="column" gap={8} width="full">
            <Flex justify="space-between" align="center" width="full">
              <Flex align="center" gap={8}>
                <Typography variant="span" color="muted" $fontSize={13}>
                  <LangDisplay text={inputLabels.gasLimit} />
                </Typography>
                <GoldQuestionMark height={14} width={14} />
              </Flex>
            </Flex>
            <FeesInput
              key={transaction.computedData.gasLimit}
              value={transaction.computedData.gasLimit}
              onChange={handleLimitChange}
            />
          </Container>
        </>
      )}
    </>
  );
};
