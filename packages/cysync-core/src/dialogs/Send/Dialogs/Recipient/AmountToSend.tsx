import React from 'react';
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
} from '@cypherock/cysync-ui';

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
    textColor,
    isCheckedMax,
    handleToggleMax,
    handleInputValueChange,
    value,
  } = useAmountToSend({
    coin,
    onChange,
    isButtonEnabled,
    throbber,
    value: initialValue,
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
        <Input
          type="number"
          name="address"
          postfixIcon={typeof coinState === 'string' ? undefined : coinState}
          postfixText={typeof coinState === 'string' ? coinState : undefined}
          $textColor={textColor}
          placeholder={placeholder}
          value={value}
          onChange={handleInputValueChange}
          $error={error === ''}
        />
        <DoubleArrow height={22} width={22} />
        <Input
          type="number"
          name="address"
          postfixText={dollar}
          $textColor={textColor}
          placeholder={placeholder}
          $error={error === ''}
        />
      </Flex>
      {!error && (
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
