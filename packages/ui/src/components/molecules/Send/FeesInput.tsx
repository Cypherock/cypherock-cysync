import React, { useCallback, useEffect, useState } from 'react';

import { CustomInputSend } from './RecipientAddress';

import { Input, Typography } from '../../atoms';

interface FeesInputProps {
  value: string;
  onChange?: (val: number) => void;
  postfixText?: string;
  valueType?: 'float' | 'integer';
}

const validFeesRegex = /^\d*\.?\d*$/;

export const FeesInput: React.FC<FeesInputProps> = ({
  value,
  postfixText,
  onChange,
  valueType = 'float',
}) => {
  const [valueInternal, setValueInternal] = useState<string>(value);

  const parseNumber = useCallback(
    (val: string) => {
      if (val === '') return 0;
      return valueType === 'float' ? parseFloat(val) : parseInt(val, 10);
    },
    [valueType],
  );

  const updateInternalValue = useCallback(() => {
    if (parseNumber(valueInternal) === parseNumber(value)) return;
    setValueInternal(value);
  }, [valueInternal, value, parseNumber]);

  useEffect(updateInternalValue, [value]);

  const onChangeProxy = useCallback(
    (newValue: number) => {
      if (!onChange) return;
      if (newValue === parseNumber(value)) return;
      onChange(newValue);
    },
    [valueInternal, value, parseNumber, onChange],
  );

  const handleOnChange = useCallback(
    (val: string) => {
      if (val === '') {
        setValueInternal(val);
        onChangeProxy(0);
        return;
      }

      const isValidInput = validFeesRegex.test(val);

      if (!isValidInput) return;
      if (valueType === 'integer' && val.includes('.')) return;

      const numberValue = parseNumber(val);

      if (Number.isNaN(numberValue)) return;

      setValueInternal(val);
      onChangeProxy(numberValue);
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
};
