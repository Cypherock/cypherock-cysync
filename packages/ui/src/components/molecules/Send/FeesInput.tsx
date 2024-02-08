import React, { useCallback, useEffect, useState } from 'react';

import {
  BigNumber,
  processNonNegativeNumericInput,
} from '@cypherock/cysync-utils';
import { CustomInputSend } from './RecipientAddress';

import { Input, Typography } from '../../atoms';

interface FeesInputProps {
  value: string;
  onChange?: (val: string) => void;
  postfixText?: string;
  valueType?: 'float' | 'integer';
  isBigNumber?: boolean;
}

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
    setValueInternal(bigNumValueExternal.toString());
  }, [valueInternal, value, parseNumber]);

  useEffect(updateInternalValue, [value]);

  const onChangeProxy = useCallback(
    (newValue: string) => {
      if (!onChange) return;
      if (parseNumber(value).isEqualTo(newValue)) return;
      onChange(newValue.toString());
    },
    [value, parseNumber, onChange],
  );

  const handleOnChange = useCallback(
    (input: string, isPasted: boolean) => {
      const result = processNonNegativeNumericInput({
        input,
        isPasted,
        isBigNumber,
        isInteger: valueType === 'integer',
      });

      if (!result.isValid) return;

      setValueInternal(result.inputValue);
      onChangeProxy(result.numericValue);
    },
    [valueType, onChangeProxy, isBigNumber],
  );

  return (
    <CustomInputSend>
      <Input
        type="text"
        name="fees"
        value={valueInternal}
        placeholder="0"
        $textColor="white"
        onChange={val => handleOnChange(val, false)}
        onPaste={val => handleOnChange(val, true)}
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
