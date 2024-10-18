import React, { useCallback, useEffect, useState } from 'react';
import { Input } from '../atoms';

interface NumberInputProps {
  name: string;
  placeholder: string;
  initialValue?: number;
  onChange?: (val: number) => void;
  valueType?: 'float' | 'integer';
}

const validInputRegex = /^\d*\.?\d*$/;

export const NumberInput: React.FC<NumberInputProps> = ({
  name,
  placeholder,
  initialValue,
  onChange,
  valueType = 'integer',
}) => {
  const value = initialValue?.toString() ?? '';
  const [valueInternal, setValueInternal] = useState<string>(value);

  const parseNumber = useCallback(
    (val: string) => {
      if (val === '') return -1;
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
        onChangeProxy(-1);
        return;
      }

      const isValidInput = validInputRegex.test(val);

      if (!isValidInput) return;
      if (valueType === 'integer' && val.includes('.')) return;

      const numberValue = parseNumber(val);

      if (Number.isNaN(numberValue)) return;
      if (valueType === 'integer' && numberValue > Number.MAX_SAFE_INTEGER)
        return;

      setValueInternal(val);
      onChangeProxy(numberValue);
    },
    [valueType, onChangeProxy, parseNumber],
  );

  return (
    <Input
      type="text"
      name={name}
      value={valueInternal}
      placeholder={placeholder}
      $textColor="white"
      onChange={handleOnChange}
      $noBorder
    />
  );
};

NumberInput.defaultProps = {
  initialValue: undefined,
  valueType: 'integer',
  onChange: undefined,
};
