import { IEvmErc20Token } from '@cypherock/coins';
import {
  DialogBox,
  Typography,
  DialogBoxBody,
  Container,
  LangDisplay,
  WalletIcon,
  MessageBox,
} from '@cypherock/cysync-ui';
import React, { useEffect } from 'react';

import { CoinIcon, LoaderDialog } from '~/components';
import { useBuySell } from '~/context';
import { selectLanguage, useAppSelector } from '~/store';

export const BuySellOrder = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.onramp.buy.redirectOrder;
  const {
    fiatAmount,
    cryptoAmount,
    isPreordering,
    preorderDetails,
    selectedWallet,
    selectedAccount,
    selectedCryptoCurrency,
    selectedFiatCurrency,
  } = useBuySell();

  useEffect(() => {
    if (preorderDetails?.link) {
      window.open(preorderDetails.link, '_blank', 'noopener,noreferrer');
    }
  }, [preorderDetails?.link]);

  if (isPreordering) {
    <LoaderDialog />;
  }

  return (
    <DialogBox width={500}>
      <DialogBoxBody px={5} py={4} gap={32}>
        <Container
          $bgColor="separatorSecondary"
          $borderRadius={40}
          width={60}
          height={60}
        >
          <CoinIcon
            assetId={selectedCryptoCurrency?.coin.coin.id}
            parentAssetId={
              (selectedCryptoCurrency?.coin.coin as IEvmErc20Token).parentId ??
              selectedCryptoCurrency?.coin.coin.id
            }
          />
        </Container>
        <Container
          display="flex"
          direction="column"
          gap={4}
          width="full"
          mb={2}
        >
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={strings.title} />
          </Typography>
          <Typography variant="h6" $textAlign="center" color="muted">
            <LangDisplay text={strings.subtitle} />
          </Typography>
        </Container>
        <Container
          display="flex"
          direction="column"
          gap={16}
          mb={2}
          width="full"
        >
          <Container display="flex" justify="space-between" width="full">
            <Typography variant="p" $fontSize={14} color="muted">
              <WalletIcon width={15} height={12} />{' '}
              {strings.info.accountFieldLabel}
            </Typography>
            <Container direction="row" gap={12}>
              <Typography $fontSize={14} color="muted">
                {selectedWallet?.name}
              </Typography>
              <Typography $fontSize={16} $fontWeight="medium" color="muted">
                /
              </Typography>
              {selectedAccount && (
                <CoinIcon
                  parentAssetId={selectedAccount.parentAssetId}
                  assetId={selectedAccount.assetId}
                />
              )}
              <Typography $fontSize={14}>{selectedAccount?.name}</Typography>
            </Container>
          </Container>
          <Container display="flex" justify="space-between" width="full">
            <Typography variant="p" $fontSize={14} color="muted">
              {strings.info.amountFieldLabel}
            </Typography>
            <Typography $fontSize={14}>
              {fiatAmount} {selectedFiatCurrency?.currency.code}
            </Typography>
          </Container>
          <Container display="flex" justify="space-between" width="full">
            <Typography variant="p" $fontSize={14} color="muted">
              {strings.info.conversionFieldLabel}
            </Typography>
            <Typography $fontSize={14}>
              {cryptoAmount} {selectedCryptoCurrency?.coin.coin.abbr}
            </Typography>
          </Container>
        </Container>
        <MessageBox
          type="info"
          text={strings.messageBox.info}
          actionButton={
            <a
              href={preorderDetails?.link}
              target="_blank"
              rel="noreferrer"
              style={{
                textDecoration: 'none',
              }}
            >
              <Typography variant="span" color="gold">
                {strings.messageBox.action}
              </Typography>
            </a>
          }
        />
      </DialogBoxBody>
    </DialogBox>
  );
};
