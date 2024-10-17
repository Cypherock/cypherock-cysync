import {
  Container,
  Flex,
  Input,
  LangDisplay,
  Typography,
  CustomInputSend,
} from '@cypherock/cysync-ui';
import lodash from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

const MAX_UNSIGNED_32BIT_INT = 0xffffffff;

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

      setValueInternal(val);
      onChangeProxy(numberValue);
    },
    [valueType, onChangeProxy, parseNumber],
  );

  return (
    <CustomInputSend>
      <Input
        type="text"
        name={name}
        value={valueInternal}
        placeholder={placeholder}
        $textColor="white"
        onChange={handleOnChange}
        $noBorder
      />
    </CustomInputSend>
  );
};

NumberInput.defaultProps = {
  initialValue: undefined,
  valueType: 'integer',
  onChange: undefined,
};

interface DestinationTagInputProps {
  label: string;
  placeholder: string;
  initialValue?: number;
  onChange: (value: number) => Promise<void>;
}

export const DestinationTagInput: React.FC<DestinationTagInputProps> = ({
  label,
  placeholder,
  initialValue,
  onChange,
}) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const lang = useAppSelector(selectLanguage);
  const displayText = lang.strings.send.recipient;

  const onValueChange = async (val: number) => {
    if (!error) {
      await onChange(val);
    }
  };

  const debouncedOnValueChange = useCallback(
    lodash.debounce(onValueChange, 300),
    [error],
  );

  const handleValueChange = (newValue: number) => {
    if (newValue < MAX_UNSIGNED_32BIT_INT) {
      setValue(newValue);
      setError('');
      debouncedOnValueChange(newValue);
    } else {
      setError(displayText.destinationTag.error);
    }
  };

  return (
    <Container display="flex" direction="column" width="full" gap={8}>
      <Flex justify="space-between" width="full">
        <Typography variant="span" color="muted" $fontSize={13}>
          <LangDisplay text={label} />
        </Typography>
      </Flex>
      <NumberInput
        name="destinationTag"
        placeholder={placeholder}
        initialValue={value}
        onChange={handleValueChange}
      />
      {error && (
        <Typography
          variant="span"
          color="error"
          $alignSelf="start"
          $fontSize={12}
        >
          {error}
        </Typography>
      )}
    </Container>
  );
};

DestinationTagInput.defaultProps = {
  initialValue: undefined,
};
