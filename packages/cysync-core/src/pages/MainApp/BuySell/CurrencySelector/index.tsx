import {
  DialogBox,
  Typography,
  DialogBoxBody,
  Container,
  LangDisplay,
  Dropdown,
  DialogBoxFooter,
  Button,
  InputLabel,
  Flex,
  BuyCrypto,
  QuestionMarkButton,
  Tooltip,
} from '@cypherock/cysync-ui';
import React, { useCallback } from 'react';

import { useBuySell } from '~/context';
import { useAppSelector, selectLanguage } from '~/store';
import logger from '~/utils/logger';

import { AmountInput } from './AmountInput';

export const BuySellCurrencySelector = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.onramp.buy.selectCurrency;
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
      <DialogBoxBody p={0} pt={4} gap={0}>
        <BuyCrypto width={56} height={48} />
        <Container
          display="flex"
          direction="column"
          gap={32}
          py={4}
          px={5}
          width="100%"
        >
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={lang.strings.onramp.buy.title} />
          </Typography>
        </Container>
        <Container
          display="flex"
          direction="column"
          px={5}
          pt={2}
          pb={4}
          gap={24}
          width="100%"
        >
          <Container direction="column" width="100%">
            <InputLabel>{strings.selectFiat.label}</InputLabel>
            <Dropdown
              items={fiatDropdownList}
              selectedItem={selectedFiatCurrency?.code}
              searchText={strings.selectFiat.searchText}
              placeholderText={strings.selectFiat.placeholder}
              onChange={handleFiatChangeProxy}
              autoFocus
            />
          </Container>
          <Container direction="column" width="100%">
            <InputLabel>{strings.selectCrypto.label}</InputLabel>
            <Dropdown
              items={cryptoDropdownList}
              selectedItem={selectedCryptoCurrency?.id}
              searchText={strings.selectCrypto.searchText}
              placeholderText={strings.selectCrypto.placeholder}
              onChange={handleCryptoChangeProxy}
              disabled={!selectedFiatCurrency}
            />
          </Container>
          <Container direction="column">
            <InputLabel>
              <Flex gap={4} align="center">
                <LangDisplay text={strings.amount.label} />
                <Tooltip
                  tooltipPlacement="bottom"
                  text={strings.amount.tooltip}
                >
                  <QuestionMarkButton />
                </Tooltip>
              </Flex>
            </InputLabel>
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
