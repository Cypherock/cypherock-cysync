import { IPreparedEvmTransaction } from '@cypherock/coin-support-evm';
import {
  Container,
  Flex,
  Typography,
  LangDisplay,
  Tag,
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
  const { getDefaultGasLimit } = useSendDialog();

  const handlePriceChange = (val: number) => {
    setGasPrice(val);
    // on change gas price, prepare EVM fee
    onChange({ gasPrice: val });
  };

  const handleLimitChange = (val: number) => {
    // on change gas limit, prepare EVM fee
    onChange({ gasLimit: val });
  };

  useEffect(() => {
    setGasPrice(initialGasPrice);
    transaction.userInputs.gasPrice = initialGasPrice.toString();
    transaction.userInputs.gasLimit = getDefaultGasLimit();
    onChange({
      gasLimit: Number(transaction.userInputs.gasLimit),
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
              </Flex>
            </Flex>
            <FeesInput
              value={gasPrice.toString()}
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
              </Flex>
            </Flex>
            <FeesInput
              value={transaction.computedData.gasLimit}
              onChange={handleLimitChange}
              valueType="integer"
            />
          </Container>
        </>
      )}
    </>
  );
};
