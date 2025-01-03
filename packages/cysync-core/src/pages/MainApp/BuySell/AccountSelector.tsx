import { IEvmErc20Token } from '@cypherock/coins';
import {
  BinanceConnet,
  cysyncLogoSmall,
  DashedLineEndCircled,
  DialogBox,
  Typography,
  DialogBoxBody,
  Container,
  LangDisplay,
  Dropdown,
  DialogBoxFooter,
  Button,
  InputLabel,
  MessageBox,
  Flex,
  Image,
} from '@cypherock/cysync-ui';
import React, { useCallback } from 'react';

import { openAddAccountDialog } from '~/actions';
import { CoinIcon, LoaderDialog } from '~/components';
import { useBuySell } from '~/context';
import { useAppSelector, selectLanguage, useAppDispatch } from '~/store';
import logger from '~/utils/logger';

export const BuySellAccountSelector = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.onramp.buy.selectWallet;
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
    selectedCryptoCurrency,
    onNextState,
    onPreviousState,
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

  if (isLoadingPaymentMethodList) return <LoaderDialog />;

  return (
    <DialogBox width={500}>
      <DialogBoxBody p={0} pt={4} gap={0}>
        <Flex direction="row" align="center" justify="center">
          <Container
            $bgColor="separatorSecondary"
            $borderRadius={40}
            width={60}
            height={60}
          >
            <Image src={cysyncLogoSmall} alt="CySync" $width={32} />
          </Container>
          <DashedLineEndCircled mx="-5px" $zIndex={10} />
          <Container
            $bgColor="separatorSecondary"
            $borderRadius={40}
            width={60}
            height={60}
          >
            <CoinIcon
              assetId={selectedCryptoCurrency?.coin.coin.id}
              parentAssetId={
                (selectedCryptoCurrency?.coin.coin as IEvmErc20Token)
                  .parentId ?? selectedCryptoCurrency?.coin.coin.id
              }
              size={32}
            />
          </Container>
          <DashedLineEndCircled mx="-5px" $zIndex={10} />
          <Container
            $bgColor="separatorSecondary"
            $borderRadius={40}
            width={60}
            height={60}
          >
            <BinanceConnet width={32} />
          </Container>
        </Flex>
        <Container
          display="flex"
          direction="column"
          gap={4}
          py={4}
          px={5}
          width="100%"
        >
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={lang.strings.onramp.buy.title} />
          </Typography>
          <Typography variant="h6" $textAlign="center" color="muted">
            <LangDisplay
              text={strings.subtitle}
              variables={{
                currencyCode: selectedCryptoCurrency?.coin.coin.abbr,
              }}
            />
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
          <Dropdown
            items={walletDropdownList}
            selectedItem={selectedWallet?.__id}
            searchText={strings.selectWallet.searchText}
            placeholderText={strings.selectWallet.placeholder}
            onChange={handleWalletChangeProxy}
            noLeftImageInList
            autoFocus
          />
          <Dropdown
            items={accountDropdownList}
            selectedItem={selectedAccount?.__id}
            disabled={!selectedWallet}
            searchText={strings.selectAccount.searchText}
            placeholderText={strings.selectAccount.placeholder}
            onChange={handleAccountChange}
          />
          <Container direction="column" width="full">
            <InputLabel>{strings.selectPaymentMethod.label}</InputLabel>
            <Dropdown
              items={paymentMethodDropdownList}
              selectedItem={
                selectedPaymentMethod
                  ? `${selectedPaymentMethod.payMethodCode}-${
                      selectedPaymentMethod.payMethodSubCode ?? ''
                    }`
                  : undefined
              }
              searchText={strings.selectPaymentMethod.searchText}
              placeholderText={strings.selectPaymentMethod.placeholder}
              onChange={handlePaymentMethodChangeProxy}
            />
          </Container>
          {selectedWallet && accountDropdownList.length === 0 && (
            <MessageBox
              type="danger"
              text={strings.messageBox.danger}
              altText={selectedCryptoCurrency?.coin.coin.name}
              actionButton={
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
                  <Typography color="gold">
                    {lang.strings.buttons.addAccount}
                  </Typography>
                </Button>
              }
            />
          )}
        </Container>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button variant="secondary" onClick={onPreviousState}>
          <LangDisplay text={lang.strings.buttons.back} />
        </Button>
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
