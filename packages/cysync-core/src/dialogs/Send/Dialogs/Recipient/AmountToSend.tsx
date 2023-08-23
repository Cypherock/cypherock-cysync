import {
  Container,
  DoubleArrow,
  Flex,
  Input,
  LangDisplay,
  Throbber,
  Toggle,
  Typography,
  useAmountToSend,
  CustomInputSend,
} from '@cypherock/cysync-ui';
import React from 'react';

interface AmountToSendProps {
  text?: string;
  error?: string;
  toggle?: string;
  coin?: React.ReactNode | string;
  dollar?: string;
  placeholder?: string;
  isButtonEnabled?: (shouldActivate: boolean) => void;
  value?: string;
  onChange?: (val: string) => void;
}

export const AmountToSend: React.FC<AmountToSendProps> = ({
  text = '',
  toggle = '',
  coin = '',
  dollar = '',
  error = '',
  placeholder = '',
  isButtonEnabled,
  value: initialValue = '',
  onChange,
}) => {
  const throbber: JSX.Element = <Throbber size={15} strokeWidth={2} />;
  const {
    coinState,
    isCheckedMax,
    handleToggleMax,
    handleCoinValueChange,
    handleDollarValueChange,
    coinValue,
    dollarValue,
    coinTextColor,
    dollarTextColor,
  } = useAmountToSend({
    coin,
    onChange,
    isButtonEnabled,
    throbber,
    coinValue: initialValue,
    dollarValue: initialValue,
  });
  return (
    <Container display="flex" direction="column" width="full" gap={8}>
      <Flex justify="space-between" width="full">
        <Typography variant="span" width="100%" color="muted" $fontSize={13}>
          <LangDisplay text={text} />
        </Typography>
        <Flex align="center" direction="row" gap={8}>
          <Typography variant="span" width="100%" color="muted" $fontSize={13}>
            <LangDisplay text={toggle} />
          </Typography>
          <Toggle checked={isCheckedMax} onToggle={handleToggleMax} />
        </Flex>
      </Flex>
      <Flex justify="space-between" gap={8} align="center" width="full">
        <CustomInputSend error={error}>
          <Input
            type="text"
            name="address"
            $textColor={coinTextColor}
            placeholder={placeholder}
            onChange={handleCoinValueChange}
            value={coinValue}
          />
          {typeof coinState === 'string' ? undefined : coinState}
          {typeof coinState === 'string' ? (
            <Typography $fontSize={16} color="muted" $allowOverflow>
              {coin}
            </Typography>
          ) : undefined}
        </CustomInputSend>
        <DoubleArrow height={22} width={22} />
        <CustomInputSend error={error}>
          <Input
            type="text"
            name="address"
            $textColor={dollarTextColor}
            placeholder={placeholder}
            onChange={handleDollarValueChange}
            value={dollarValue}
          />
          {typeof coinState === 'string' ? undefined : coinState}
          {typeof coinState === 'string' ? (
            <Typography $fontSize={16} color="muted" $allowOverflow>
              {dollar}
            </Typography>
          ) : undefined}
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

AmountToSend.defaultProps = {
  text: '',
  error: '',
  toggle: '',
  coin: 'BTC',
  dollar: '$',
  isButtonEnabled: undefined,
  placeholder: '',
  value: '',
  onChange: undefined,
};
