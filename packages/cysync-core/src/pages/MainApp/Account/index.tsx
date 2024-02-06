import { BtcIdMap, coinFamiliesMap, coinList } from '@cypherock/coins';
import {
  Breadcrumb,
  Button,
  Container,
  Flex,
  ArrowSentIcon,
  ArrowReceivedIcon,
  SvgProps,
  WalletConnectWithBgIcon,
  DeleteIconWithBg,
} from '@cypherock/cysync-ui';
import lodash from 'lodash';
import React, { FC } from 'react';

import {
  openDeleteAccountDialog,
  openReceiveDialog,
  openSendDialog,
  openWalletConnectDialog,
} from '~/actions';
import { CoinIcon, Graph, TransactionTable } from '~/components';
import { supportedWalletConnectFamilies } from '~/context';
import { selectLanguage, useAppDispatch, useAppSelector } from '~/store';

import { TokenTable } from './TokenTable';

import { useAccountPage } from '../hooks';
import { MainAppLayout } from '../Layout';

const ReceiveIcon = (props: SvgProps) => (
  <ArrowReceivedIcon {...props} $width="12px" $height="12px" />
);

const SendIcon = (props: SvgProps) => (
  <ArrowSentIcon {...props} $width="12px" $height="12px" />
);

export const AccountPage: FC = () => {
  const dispatch = useAppDispatch();
  const lang = useAppSelector(selectLanguage);

  const {
    selectedWallet,
    accountId,
    selectedAccount,
    breadcrumbItems,
    onAccountChange,
    handleWalletChange,
    walletDropdownList,
  } = useAccountPage();

  const getMainContent = () => {
    if (!selectedAccount) {
      return null;
    }

    const doAllowAccountDeletion = () => {
      if (window.cysyncFeatureFlags.ADD_TOKEN) return true;

      return !selectedAccount.parentAccount;
    };

    return (
      <Container $noFlex m="20">
        <Flex justify="space-between" my={2}>
          <Breadcrumb items={breadcrumbItems} />
          <Flex gap={8}>
            <Button
              variant="secondary"
              onClick={() =>
                dispatch(
                  openSendDialog({
                    accountId: selectedAccount.__id,
                    walletId: selectedAccount.walletId,
                  }),
                )
              }
              size="sm"
              display="flex"
              justify="center"
              align="center"
              iconComponent={SendIcon}
            >
              {lang.strings.buttons.send}
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                dispatch(
                  openReceiveDialog({
                    accountId: selectedAccount.__id,
                    walletId: selectedAccount.walletId,
                  }),
                )
              }
              size="sm"
              display="flex"
              justify="center"
              align="center"
              iconComponent={ReceiveIcon}
            >
              {lang.strings.buttons.receive}
            </Button>
            <Container pl={{ def: 0, mdlg: 4 }} gap={8}>
              {supportedWalletConnectFamilies.includes(
                selectedAccount.familyId ?? '',
              ) && (
                <Button
                  variant="icon"
                  onClick={() => {
                    dispatch(openWalletConnectDialog());
                  }}
                >
                  <WalletConnectWithBgIcon />
                </Button>
              )}

              {doAllowAccountDeletion() && (
                <Button
                  variant="icon"
                  onClick={() => {
                    if (selectedAccount)
                      dispatch(
                        openDeleteAccountDialog({
                          account: selectedAccount,
                          wallet: selectedAccount.wallet,
                        }),
                      );
                  }}
                >
                  <DeleteIconWithBg />
                </Button>
              )}
            </Container>
          </Flex>
        </Flex>

        <Container $noFlex mb={2}>
          <Graph
            selectedWallet={selectedWallet}
            handleWalletChange={handleWalletChange}
            walletDropdownList={walletDropdownList}
            accountId={accountId}
            color={
              selectedAccount.asset?.color ?? coinList[BtcIdMap.bitcoin].color
            }
          />
        </Container>

        {selectedAccount.familyId === coinFamiliesMap.evm && accountId && (
          <Container $noFlex mb={2}>
            <TokenTable accountId={accountId} onClick={onAccountChange} />
          </Container>
        )}

        <Container $noFlex mb={2}>
          <TransactionTable
            limit={10}
            walletId={selectedWallet?.__id}
            accountId={accountId}
            variant="withTimeAndValues"
          />
        </Container>
      </Container>
    );
  };

  return (
    <MainAppLayout
      topbar={{
        title: selectedAccount?.name ?? '',
        icon: selectedAccount ? (
          <CoinIcon
            parentAssetId={selectedAccount.parentAssetId ?? ''}
            assetId={selectedAccount.assetId}
            size={{ def: '24px', lg: '32px' }}
            containerSize={{ def: '32px', lg: '40px' }}
            withBackground
            withParentIconAtBottom
            subIconSize={{ def: '12px', lg: '18px' }}
          />
        ) : undefined,
        subTitle: (selectedAccount?.asset?.name ?? '').toUpperCase(),
        tag: lodash.upperCase(selectedAccount?.derivationScheme ?? ''),
      }}
    >
      {getMainContent()}
    </MainAppLayout>
  );
};
