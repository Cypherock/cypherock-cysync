import {
  Container,
  DoubleArrow,
  Flex,
  Input,
  LangDisplay,
  Throbber,
  Typography,
  CustomInputSend,
} from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import lodash from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';

interface AmountInputProps {
  fiatUnit: string;
  cryptoUnit: string;
  placeholder?: string;
  fiatAmount?: string;
  cryptoAmount?: string;
  onFiatAmountChange: (amount: string) => Promise<void>;
  onCryptoAmountChange: (amount: string) => Promise<void>;
  error?: string;
  isDisabled?: boolean;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  fiatUnit,
  cryptoUnit,
  error,
  placeholder,
  fiatAmount,
  cryptoAmount,
  onFiatAmountChange,
  onCryptoAmountChange,
  isDisabled,
}) => {
  const throbber: JSX.Element = <Throbber size={15} strokeWidth={2} />;
  const [isLoading, setIsLoading] = useState(false);
  const [internalFiatAmount, setInternalFiatAmount] = useState<string>(
    fiatAmount ?? '',
  );
  const [internalCryptoAmount, setInternalCoinCryptoAmount] = useState<string>(
    cryptoAmount ?? '0',
  );

  const parsedError = () => {
    if (isLoading) return '';
    return internalFiatAmount !== '' ? error : '';
  };

  useEffect(() => {
    if (!fiatAmount && !cryptoAmount) {
      setInternalFiatAmount('');
      setInternalCoinCryptoAmount('');
    }
  }, [fiatAmount, cryptoAmount]);

  useEffect(() => {
    if (fiatAmount) {
      setInternalFiatAmount(fiatAmount);
    }
  }, [fiatAmount]);

  useEffect(() => {
    if (cryptoAmount) {
      setInternalCoinCryptoAmount(cryptoAmount);
    }
  }, [cryptoAmount]);

  const onFiatChange = async (val: string) => {
    setIsLoading(true);
    await onFiatAmountChange(val);
    setIsLoading(false);
  };

  const onCryptoChange = async (val: string) => {
    setIsLoading(true);
    await onCryptoAmountChange(val);
    setIsLoading(false);
  };

  const debouncedOnFiatChange = useCallback(
    lodash.debounce(onFiatChange, 300),
    [],
  );

  const debouncedOnCryptoChange = useCallback(
    lodash.debounce(onCryptoChange, 300),
    [],
  );

  const filterNumericInput = (val: string) => {
    let filteredValue = val.replace(/[^0-9.]/g, '');
    const bigNum = new BigNumber(filteredValue);

    if (filteredValue.includes('.')) {
      const splitValue = filteredValue.split('.');
      let firstValue = splitValue[0];
      const secondValue = splitValue[1];

      const firstValBigNumber = new BigNumber(firstValue);

      if (firstValBigNumber.isNaN() || firstValBigNumber.isZero()) {
        firstValue = '0';
      }

      filteredValue = `${firstValue}.${secondValue}`;
    } else if (!bigNum.isNaN() && bigNum.isZero()) {
      filteredValue = '0';
    }

    return filteredValue;
  };

  const handleFiatAmountChange = (val: string) => {
    const filteredValue = filterNumericInput(val);
    setInternalFiatAmount(filteredValue);
    debouncedOnFiatChange(filteredValue);
  };

  const handleCoinValueChange = (val: string) => {
    const filteredValue = filterNumericInput(val);
    setInternalCoinCryptoAmount(filteredValue);
    debouncedOnCryptoChange(filteredValue);
  };

  return (
    <Container display="flex" direction="column" width="full" gap={8}>
      <Flex justify="space-between" gap={8} align="center" width="full">
        <CustomInputSend error={parsedError()}>
          <Input
            type="text"
            name="address"
            placeholder={placeholder}
            onChange={handleFiatAmountChange}
            value={internalFiatAmount}
            disabled={isDisabled}
            $textColor="white"
            $noBorder
          />
          {isLoading ? (
            throbber
          ) : (
            <Typography $fontSize={16} color="muted" $allowOverflow>
              {fiatUnit}
            </Typography>
          )}
        </CustomInputSend>
        <DoubleArrow height={22} width={22} />
        <CustomInputSend error={parsedError()}>
          <Input
            type="text"
            name="address"
            placeholder={placeholder}
            onChange={handleCoinValueChange}
            value={internalCryptoAmount}
            disabled // Force disabling the input because binance api doesn't return the crypto amount for the same fiat amount
            $textColor="white"
            $noBorder
          />
          {isLoading ? (
            throbber
          ) : (
            <Typography $fontSize={16} color="muted" $allowOverflow>
              {cryptoUnit}
            </Typography>
          )}
        </CustomInputSend>
      </Flex>
      {parsedError() && (
        <Typography
          variant="span"
          color="error"
          $alignSelf="start"
          $fontSize={12}
        >
          <LangDisplay text={parsedError() ?? ''} />
        </Typography>
      )}
    </Container>
  );
};

AmountInput.defaultProps = {
  error: '',
  placeholder: '',
  fiatAmount: '',
  isDisabled: undefined,
  cryptoAmount: '',
};
