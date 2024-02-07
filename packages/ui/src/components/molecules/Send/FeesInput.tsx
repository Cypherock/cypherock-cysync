import React, { useCallback, useEffect, useState } from 'react';

import { BigNumber } from '@cypherock/cysync-utils';
import { CustomInputSend } from './RecipientAddress';

import { Input, Typography } from '../../atoms';

interface FeesInputProps {
  value: string;
  onChange?: (val: string) => void;
  postfixText?: string;
  valueType?: 'float' | 'integer';
  isBigNumber?: boolean;
}

const validFeesRegex = /^\d*\.?\d*$/;

export const FeesInput: React.FC<FeesInputProps> = ({
  value,
  postfixText,
  onChange,
  valueType = 'float',
  isBigNumber = false,
}) => {
  const [valueInternal, setValueInternal] = useState<string>(value);

  const parseNumber: (val: string) => BigNumber = useCallback(
    (val: string): BigNumber => {
      if (val === '') return new BigNumber(0);
      const parsedResult =
        valueType === 'float'
          ? new BigNumber(val).toFixed()
          : new BigNumber(val).toFixed(0);
      return new BigNumber(parsedResult);
    },
    [valueType],
  );

  const updateInternalValue = useCallback(() => {
    const bigNumValueInternal = parseNumber(valueInternal);
    const bigNumValueExternal = parseNumber(value);
    if (bigNumValueInternal.isEqualTo(bigNumValueExternal)) return;
    setValueInternal(bigNumValueExternal.toFixed());
  }, [valueInternal, value, parseNumber]);

  useEffect(updateInternalValue, [value]);

  const onChangeProxy = useCallback(
    (newValue: BigNumber) => {
      if (!onChange) return;
      if (newValue.isEqualTo(parseNumber(value))) return;
      onChange(newValue.toString());
    },
    [valueInternal, value, parseNumber, onChange],
  );

  const handleOnChange = useCallback(
    (val: string) => {
      if (val === '') {
        setValueInternal(val);
        onChangeProxy(new BigNumber(0));
        return;
      }

      const isValidInput = validFeesRegex.test(val);

      if (!isValidInput) return;
      if (valueType === 'integer' && val.includes('.')) return;

      const bigNumVal = parseNumber(val);
      if (bigNumVal.isNaN()) return;
      if (!isBigNumber && bigNumVal.isGreaterThan(Number.MAX_SAFE_INTEGER))
        return;

      // avoid insignificant zero from start
      let finalInputValue = val;
      while (
        finalInputValue.startsWith('00') ||
        (finalInputValue.startsWith('0') && valueType === 'integer') ||
        (finalInputValue.startsWith('0') &&
          finalInputValue.includes('.') &&
          !finalInputValue.startsWith('0.'))
      ) {
        finalInputValue = finalInputValue.slice(1);
      }

      setValueInternal(finalInputValue);
      onChangeProxy(bigNumVal);
    },
    [valueType, onChangeProxy, parseNumber],
  );

  return (
    <CustomInputSend>
      <Input
        type="text"
        name="fees"
        value={valueInternal}
        placeholder="0"
        $textColor="white"
        onChange={handleOnChange}
        $noBorder
      />

      {postfixText !== '' ? (
        <Typography
          $fontSize={16}
          color="muted"
          $allowOverflow
          $whiteSpace="nowrap"
          $textOverflow="ellipsis"
        >
          {postfixText}
        </Typography>
      ) : undefined}
    </CustomInputSend>
  );
};

FeesInput.defaultProps = {
  postfixText: '',
  valueType: 'float',
  onChange: undefined,
  isBigNumber: false,
};
