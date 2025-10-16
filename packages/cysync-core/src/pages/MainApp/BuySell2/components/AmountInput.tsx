import {
  Container,
  Input,
  Typography,
  Flex,
  CustomInputSend,
} from '@cypherock/cysync-ui';
import React from 'react';
import { useSelector } from 'react-redux';

import { useBuySell2 } from '~/context/buySell2';
import { ANALYTICS_EVENTS, analyticsService } from '~/services';
import { selectLanguage } from '~/store';

export const AmountInput = () => {
  const lang = useSelector(selectLanguage);

  const strings = lang.strings.buySell2.input.amount;

  const {
    selectedFiatCurrency,
    selectedCrypto,
    amount,
    setAmount,
    receiveAmount,
  } = useBuySell2();

  const setAmountProxy: typeof setAmount = (newAmount: string) => {
    if (newAmount && newAmount !== '0') {
      analyticsService.trackEvent(ANALYTICS_EVENTS.BUY_CRYPTO_AMOUNT_ENTERED, {
        currency: selectedFiatCurrency?.code,
        type: 'fiat',
      });
    }
    setAmount(newAmount);
  };

  return (
    <Flex gap={16} width="full">
      <Container direction="column" width="full" gap={8} align="flex-start">
        <Typography $fontSize={12} color="muted">
          {strings.pay.title}
        </Typography>
        <CustomInputSend>
          <Input
            autoFocus
            type="text"
            name="payAmount"
            value={amount}
            onChange={setAmountProxy}
            placeholder="0.00"
            $textColor="white"
            $noBorder
          />
          {selectedFiatCurrency?.code && (
            <Typography $fontSize={16} color="muted" $allowOverflow>
              {selectedFiatCurrency.code.toUpperCase()}
            </Typography>
          )}
        </CustomInputSend>
      </Container>

      <Container direction="column" width="full" gap={8} align="flex-start">
        <Typography $fontSize={12} color="muted">
          {strings.receive.title}
        </Typography>
        <CustomInputSend>
          <Input
            type="text"
            name="receiveAmount"
            value={receiveAmount}
            placeholder="0.00"
            $textColor="muted"
            disabled
            $noBorder
          />
          {selectedCrypto?.abbr && (
            <Typography $fontSize={16} color="muted" $allowOverflow>
              {selectedCrypto.abbr.toUpperCase()}
            </Typography>
          )}
        </CustomInputSend>
      </Container>
    </Flex>
  );
};
