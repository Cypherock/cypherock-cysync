import {
  DialogBox,
  DialogBoxHeader,
  Typography,
  DialogBoxBody,
  Container,
  LangDisplay,
  Dropdown,
  DialogBoxFooter,
  Button,
} from '@cypherock/cysync-ui';
import React, { useCallback } from 'react';

import { useBuySell } from '~/context';
import { useAppSelector, selectLanguage } from '~/store';
import logger from '~/utils/logger';

import { AmountInput } from './AmountInput';

export const BuySellCurrencySelector = () => {
  const lang = useAppSelector(selectLanguage);
  const {
    fiatDropdownList,
    cryptoDropdownList,
    selectedFiatCurrency,
    selectedCryptoCurrency,
    handleFiatCurrencyChange,
    handleCryptoCurrencyChange,
    onNextState,
    fiatAmount,
    cryptoAmount,
    amountError,
    isAmountDiabled,
    onFiatAmountChange,
    onCryptoAmountChange,
  } = useBuySell();

  const handleFiatChangeProxy: typeof handleFiatCurrencyChange = useCallback(
    currency => {
      logger.info('Dropdown Change: Fiat Currency Change', {
        source: 'Buy',
        currency,
      });
      handleFiatCurrencyChange(currency);
    },
    [handleFiatCurrencyChange],
  );

  const handleCryptoChangeProxy: typeof handleCryptoCurrencyChange =
    useCallback(
      currency => {
        logger.info('Dropdown Change: Crypto Currency Change', {
          source: 'Buy',
          currency,
        });
        handleCryptoCurrencyChange(currency);
      },
      [handleCryptoCurrencyChange],
    );

  return (
    <DialogBox width={500}>
      <DialogBoxHeader direction="row" py={2} px={3}>
        <Typography
          grow={1}
          $alignSelf="stretch"
          color="muted"
          $textAlign="center"
        >
          Buy
        </Typography>
      </DialogBoxHeader>

      <DialogBoxBody p={0} gap={0}>
        <Container
          display="flex"
          direction="column"
          gap={32}
          py={4}
          px={5}
          width="full"
        >
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text="Buy" />
          </Typography>
        </Container>
        <Container
          display="flex"
          direction="column"
          px={5}
          pt={2}
          pb={4}
          gap={24}
          width="full"
        >
          <Dropdown
            items={fiatDropdownList}
            selectedItem={selectedFiatCurrency?.code}
            searchText="Search fiat currency"
            placeholderText="Select fiat currency"
            onChange={handleFiatChangeProxy}
          />
          <Dropdown
            items={cryptoDropdownList}
            selectedItem={selectedCryptoCurrency?.id}
            searchText="Search crypto currency"
            placeholderText="Select crypto currency"
            onChange={handleCryptoChangeProxy}
          />
          <AmountInput
            fiatUnit={selectedFiatCurrency?.code ?? ''}
            cryptoUnit={selectedCryptoCurrency?.coin.coin.abbr ?? ''}
            error={amountError}
            placeholder="0.00"
            fiatAmount={fiatAmount}
            cryptoAmount={cryptoAmount}
            onFiatAmountChange={onFiatAmountChange}
            onCryptoAmountChange={onCryptoAmountChange}
            isDisabled={isAmountDiabled}
          />
        </Container>
      </DialogBoxBody>

      <DialogBoxFooter>
        <Button
          variant="primary"
          disabled={Boolean(
            !selectedCryptoCurrency ||
              !selectedFiatCurrency ||
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              amountError ||
              !fiatAmount ||
              !cryptoAmount,
          )}
          onClick={onNextState}
        >
          <LangDisplay text={lang.strings.buttons.continue} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
