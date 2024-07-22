import {
  Container,
  DoubleArrow,
  Flex,
  Input,
  LangDisplay,
  Throbber,
  Toggle,
  Typography,
  CustomInputSend,
} from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import lodash from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';

interface AmountInputProps {
  coinUnit: string;
  priceUnit: string;
  label: string;
  placeholder?: string;
  toggleLabel?: string;
  initialToggle?: boolean;
  initialAmount?: string;
  overrideAmount?: string;
  onToggle?: (val: boolean) => Promise<string>;
  onChange: (amount: string) => Promise<void>;
  converter: (val: string, invert?: boolean) => string;
  error?: string;
  isDisabled?: boolean;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  label,
  toggleLabel,
  coinUnit,
  priceUnit,
  error,
  placeholder,
  onToggle,
  initialAmount,
  initialToggle,
  onChange,
  converter,
  overrideAmount,
  isDisabled,
}) => {
  const throbber: JSX.Element = <Throbber size={15} strokeWidth={2} />;
  const [isLoading, setIsLoading] = useState(false);
  const [coinAmount, setCoinAmount] = useState<string>(initialAmount ?? '');
  const [coinValue, setCoinValue] = useState<string>(
    converter(initialAmount ?? '0') || '',
  );

  const [isToggled, setIsToggled] = useState(initialToggle ?? false);

  const parsedError = () => (coinAmount !== '' ? error : '');

  useEffect(() => {
    if (overrideAmount)
      updateValues(overrideAmount, converter(overrideAmount), true);
  }, [overrideAmount]);

  const onValueChange = async (val: string) => {
    setIsLoading(true);
    await onChange(val);
    setIsLoading(false);
  };

  const debouncedOnValueChange = useCallback(
    lodash.debounce(onValueChange, 300),
    [],
  );

  const onSendMax = async (toggled: boolean) => {
    if (!onToggle) return;
    setIsLoading(true);
    const value = await onToggle(toggled);
    updateValues(value, converter(value), true);
    setIsLoading(false);
  };

  const debouncedOnSendMax = useCallback(lodash.debounce(onSendMax, 300), []);

  const handleToggleMax = (checked: boolean) => {
    setIsToggled(checked);
    debouncedOnSendMax(checked);
  };

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

  const updateValues = (amount: string, value: string, skipCall?: boolean) => {
    setCoinAmount(amount);
    setCoinValue(value);
    if (!skipCall) debouncedOnValueChange(amount);
  };

  const handleCoinAmountChange = (val: string) => {
    const filteredValue = filterNumericInput(val);
    updateValues(filteredValue, converter(filteredValue));
  };

  const handleCoinValueChange = (val: string) => {
    const filteredValue = filterNumericInput(val);
    updateValues(converter(filteredValue, true), filteredValue);
  };

  return (
    <Container display="flex" direction="column" width="full" gap={8}>
      <Flex justify="space-between" width="full">
        <Typography variant="span" color="muted" $fontSize={13}>
          <LangDisplay text={label} />
        </Typography>
        {toggleLabel && (
          <Flex align="center" direction="row" gap={8}>
            <Typography variant="span" color="muted" $fontSize={13}>
              <LangDisplay text={toggleLabel} />
            </Typography>
            <Toggle checked={isToggled} onToggle={handleToggleMax} />
          </Flex>
        )}
      </Flex>
      <Flex justify="space-between" gap={8} align="center" width="full">
        <CustomInputSend error={parsedError()}>
          <Input
            type="text"
            name="address"
            placeholder={placeholder}
            onChange={handleCoinAmountChange}
            value={coinAmount}
            disabled={isToggled || isDisabled}
            $textColor="white"
            $noBorder
          />
          {isLoading ? (
            throbber
          ) : (
            <Typography $fontSize={16} color="muted" $allowOverflow>
              {coinUnit}
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
            value={coinValue}
            disabled={isToggled || isDisabled}
            $textColor="white"
            $noBorder
          />
          {isLoading ? (
            throbber
          ) : (
            <Typography $fontSize={16} color="muted" $allowOverflow>
              {priceUnit}
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
  initialAmount: '',
  onToggle: undefined,
  toggleLabel: undefined,
  initialToggle: false,
  overrideAmount: undefined,
  isDisabled: undefined,
};
