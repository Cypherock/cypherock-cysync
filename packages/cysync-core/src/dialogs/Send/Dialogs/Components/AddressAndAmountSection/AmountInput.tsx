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
import lodash from 'lodash';
import React, { useCallback, useState } from 'react';

interface AmountInputProps {
  coinUnit: string;
  priceUnit: string;
  label: string;
  toggleLabel: string;
  placeholder?: string;
  initialValue?: string;
  onToggle?: () => Promise<string>;
  onChange: (amount: string) => Promise<void>;
  converter: (val: string, invert?: boolean) => string;
  error?: string;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  label,
  toggleLabel,
  coinUnit,
  priceUnit,
  error,
  placeholder,
  onToggle,
  initialValue,
  onChange,
  converter,
}) => {
  const throbber: JSX.Element = <Throbber size={15} strokeWidth={2} />;
  const [isLoading, setIsLoading] = useState(false);
  const [firstValue, setFirstValue] = useState<string>(initialValue ?? '');
  const [secondValue, setSecondValue] = useState<string>(
    converter(initialValue ?? '0') || '',
  );

  const [isToggled, setIsToggled] = useState(false);

  const onValueChange = async (val: string) => {
    setIsLoading(true);
    await onChange(val);
    setIsLoading(false);
  };

  const debouncedOnValueChange = useCallback(
    lodash.debounce(onValueChange, 300),
    [],
  );

  const onSendMax = async () => {
    if (!onToggle) return;
    setIsLoading(true);
    const value = await onToggle();
    updateValues(value, converter(value), true);
    setIsLoading(false);
  };

  const debouncedOnSendMax = useCallback(lodash.debounce(onSendMax, 300), []);

  const handleToggleMax = (checked: boolean) => {
    setIsToggled(checked);
    if (checked) debouncedOnSendMax();
  };

  const filterNumericInput = (val: string) => val.replace(/[^0-9.]/g, '');

  const updateValues = (first: string, second: string, skipCall?: boolean) => {
    console.log({ first, second });
    setFirstValue(first);
    setSecondValue(second);
    if (!skipCall) debouncedOnValueChange(first);
  };

  const handleCoinValueChange = (val: string) => {
    const filteredValue = filterNumericInput(val);
    updateValues(filteredValue, converter(filteredValue));
  };

  const handlePriceValueChange = (val: string) => {
    const filteredValue = filterNumericInput(val);
    updateValues(converter(filteredValue, true), filteredValue);
  };

  return (
    <Container display="flex" direction="column" width="full" gap={8}>
      <Flex justify="space-between" width="full">
        <Typography variant="span" width="100%" color="muted" $fontSize={13}>
          <LangDisplay text={label} />
        </Typography>
        <Flex align="center" direction="row" gap={8}>
          <Typography variant="span" width="100%" color="muted" $fontSize={13}>
            <LangDisplay text={toggleLabel} />
          </Typography>
          <Toggle checked={isToggled} onToggle={handleToggleMax} />
        </Flex>
      </Flex>
      <Flex justify="space-between" gap={8} align="center" width="full">
        <CustomInputSend error={error}>
          <Input
            type="text"
            name="address"
            placeholder={placeholder}
            onChange={handleCoinValueChange}
            value={firstValue}
            disabled={isToggled}
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
        <CustomInputSend error={error}>
          <Input
            type="text"
            name="address"
            placeholder={placeholder}
            onChange={handlePriceValueChange}
            value={secondValue}
            disabled={isToggled}
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
      {error && (
        <Typography
          variant="span"
          width="100%"
          color="error"
          $alignSelf="start"
          $fontSize={12}
        >
          <LangDisplay text={error} />
        </Typography>
      )}
    </Container>
  );
};

AmountInput.defaultProps = {
  error: '',
  placeholder: '',
  initialValue: '',
  onToggle: undefined,
};
