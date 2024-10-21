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
  Throbber,
} from '@cypherock/cysync-ui';
import React, { useCallback } from 'react';

import { openAddAccountDialog } from '~/actions';
import { useBuySell } from '~/context';
import { useAppSelector, selectLanguage, useAppDispatch } from '~/store';
import logger from '~/utils/logger';

export const BuySellAccountSelector = () => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();

  const {
    selectedWallet,
    handleWalletChange,
    walletDropdownList,
    accountDropdownList,
    selectedAccount,
    setSelectedAccount,
    accountList,
    selectedPaymentMethod,
    paymentMethodDropdownList,
    handlePaymentMethodChange,
    isLoadingPaymentMethodList,
    fiatAmount,
    selectedFiatCurrency,
    selectedCryptoCurrency,
    cryptoAmount,
    onNextState,
  } = useBuySell();

  const handleWalletChangeProxy: typeof handleWalletChange = useCallback(
    (...args) => {
      logger.info('Dropdown Change: Wallet Change', {
        source: 'Buy',
        isWalletSelected: Boolean(args[0]),
      });
      handleWalletChange(...args);
    },
    [handleWalletChange],
  );

  const handleAccountChange = useCallback(
    (id?: string) => {
      const targetAccount = !id ? undefined : accountList[id];
      logger.info('Dropdown Change: Account Change', {
        source: 'Buy',
        account: targetAccount
          ? {
              assetId: targetAccount.assetId,
              derivationPath: targetAccount.derivationPath,
            }
          : undefined,
      });
      setSelectedAccount(targetAccount);
    },
    [accountList],
  );

  const handlePaymentMethodChangeProxy: typeof handlePaymentMethodChange =
    useCallback(
      (id?: string) => {
        logger.info('Dropdown Change: Payment Method Change', {
          source: 'Buy',
          id,
        });
        handlePaymentMethodChange(id);
      },
      [handlePaymentMethodChange],
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
          <Typography $textAlign="center" width="full">
            {fiatAmount} {selectedFiatCurrency?.currency.code} ~= {cryptoAmount}{' '}
            {selectedCryptoCurrency?.coin.coin.abbr}
          </Typography>
          <Dropdown
            items={walletDropdownList}
            selectedItem={selectedWallet?.__id}
            searchText="Search wallet"
            placeholderText="Select wallet"
            onChange={handleWalletChangeProxy}
            noLeftImageInList
          />
          <Dropdown
            items={accountDropdownList}
            selectedItem={selectedAccount?.__id}
            disabled={!selectedWallet}
            searchText="Search account"
            placeholderText="Select account"
            onChange={handleAccountChange}
          />
          {isLoadingPaymentMethodList && <Throbber size={24} strokeWidth={3} />}
          {!isLoadingPaymentMethodList && (
            <Dropdown
              items={paymentMethodDropdownList}
              selectedItem={
                selectedPaymentMethod
                  ? `${selectedPaymentMethod.payMethodCode}-${
                      selectedPaymentMethod.payMethodSubCode ?? ''
                    }`
                  : undefined
              }
              searchText="Search payment method"
              placeholderText="Select payment method"
              onChange={handlePaymentMethodChangeProxy}
            />
          )}
          {selectedWallet && accountDropdownList.length === 0 && (
            <Typography $textAlign="center" color="muted">
              <LangDisplay text="No accounts found for selected crypto currency" />
              <Button
                variant="text"
                onClick={() =>
                  dispatch(
                    openAddAccountDialog({
                      coinId: selectedCryptoCurrency?.coin.coin.id,
                      walletId: selectedWallet.__id,
                    }),
                  )
                }
              >
                <Typography color="gold">Add Account</Typography>
              </Button>
            </Typography>
          )}
        </Container>
      </DialogBoxBody>

      <DialogBoxFooter>
        <Button
          variant="primary"
          disabled={
            !selectedWallet || !selectedAccount || !selectedPaymentMethod
          }
          onClick={onNextState}
        >
          <LangDisplay text={lang.strings.buttons.continue} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
