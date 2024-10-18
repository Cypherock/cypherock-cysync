import {
  DialogBox,
  Typography,
  DialogBoxBody,
  Container,
  LangDisplay,
  WalletIcon,
  LeanBox,
  InfoItalicsIcon,
  useTheme,
} from '@cypherock/cysync-ui';
import React, { useEffect } from 'react';

import { CoinIcon, LoaderDialog } from '~/components';
import { useBuySell } from '~/context';
// import { useNavigateTo } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

export const BuySellOrder = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.onramp.buy.redirectOrder;
  const theme = useTheme();
  // const navigateTo = useNavigateTo();
  const {
    fiatAmount,
    cryptoAmount,
    isPreordering,
    preorderDetails,
    selectedWallet,
    selectedAccount,
  } = useBuySell();

  useEffect(() => {
    if (preorderDetails?.link) {
      window.open(preorderDetails.link, '_blank', 'noopener,noreferrer');
    }
  }, [preorderDetails?.link]);

  // const onComplete = useCallback(() => {
  //   reset();
  //   navigateTo(
  //     `${routes.account.path}?accountId=${selectedAccount?.__id}&fromWalletId=${selectedWallet?.__id}`,
  //   );
  // }, [navigateTo, reset, selectedWallet, selectedAccount]);

  if (isPreordering) {
    <LoaderDialog />;
  }

  return (
    <DialogBox width={500}>
      <DialogBoxBody px={5} py={4} gap={32}>
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
            <Typography $fontSize={14} color="muted">
              {selectedWallet?.name}
              {' / '}
              {selectedAccount && (
                <CoinIcon
                  parentAssetId={selectedAccount.parentAssetId}
                  assetId={selectedAccount.assetId}
                />
              )}
              {selectedAccount?.name}
            </Typography>
          </Container>
          <Container display="flex" justify="space-between" width="full">
            <Typography variant="p" $fontSize={14} color="muted">
              {strings.info.amountFieldLabel}
            </Typography>
            <Typography $fontSize={14} color="muted">
              {fiatAmount}
            </Typography>
          </Container>
          <Container display="flex" justify="space-between" width="full">
            <Typography variant="p" $fontSize={14} color="muted">
              {strings.info.conversionFieldLabel}
            </Typography>
            <Typography $fontSize={14} color="muted">
              {cryptoAmount}
            </Typography>
          </Container>
        </Container>
        <LeanBox
          leftImage={<InfoItalicsIcon fill={theme.palette.bullet.white} />}
          text={strings.messageBox.info}
          rightImage={
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
