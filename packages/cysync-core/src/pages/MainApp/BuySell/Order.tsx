import {
  DialogBox,
  DialogBoxHeader,
  Typography,
  DialogBoxBody,
  Container,
  LangDisplay,
  Button,
  DialogBoxFooter,
} from '@cypherock/cysync-ui';
import React, { useCallback, useEffect } from 'react';

import { LoaderDialog } from '~/components';
import { routes } from '~/constants';
import { useBuySell } from '~/context';
import { useNavigateTo } from '~/hooks';

export const BuySellOrder = () => {
  const navigateTo = useNavigateTo();
  const {
    fiatAmount,
    selectedFiatCurrency,
    selectedCryptoCurrency,
    cryptoAmount,
    isPreordering,
    preorderDetails,
    reset,
    selectedWallet,
    selectedAccount,
  } = useBuySell();

  useEffect(() => {
    if (preorderDetails?.link) {
      window.open(preorderDetails.link, '_blank', 'noopener,noreferrer');
    }
  }, [preorderDetails?.link]);

  const onComplete = useCallback(() => {
    reset();
    navigateTo(
      `${routes.account.path}?accountId=${selectedAccount?.__id}&fromWalletId=${selectedWallet?.__id}`,
    );
  }, [navigateTo, reset, selectedWallet, selectedAccount]);

  if (isPreordering) {
    <LoaderDialog />;
  }

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
          gap={16}
          width="full"
        >
          <Typography $textAlign="center" width="full">
            {fiatAmount} {selectedFiatCurrency?.currency.code} ~= {cryptoAmount}{' '}
            {selectedCryptoCurrency?.coin.coin.abbr}
          </Typography>

          <Typography $textAlign="center" width="full">
            Complete the order from your browser.
          </Typography>

          <Typography $textAlign="center" width="full">
            Browser did not open?{' '}
            <a href={preorderDetails?.link} target="_blank" rel="noreferrer">
              Click here
            </a>{' '}
            to open it.
          </Typography>
        </Container>
      </DialogBoxBody>

      <DialogBoxFooter>
        <Button variant="primary" onClick={onComplete}>
          <LangDisplay text="Order completed" />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
