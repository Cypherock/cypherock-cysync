import { coinList } from '@cypherock/coins';
import {
  Button,
  Container,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  LangDisplay,
  Typography,
  AlertBox,
  BulletList,
  Flex,
  ScrollableContainer,
  WalletIcon,
  parseLangTemplate,
} from '@cypherock/cysync-ui';
import { IAccount } from '@cypherock/db-interfaces';
import React, { useMemo } from 'react';

import { CoinIcon } from '~/components';
import { useWalletConnect } from '~/context';
import { selectLanguage, useAppSelector } from '~/store';
import { getBalanceToDisplay, truncateMiddle } from '~/utils';

import { DappConnectionDisplay } from './Components';

interface ConnectAccountParam {
  name: string;
  accounts: IAccount[];
}

const ConnectAccounts: React.FC<ConnectAccountParam> = ({ name, accounts }) => (
  <Container direction="column" gap={8} align="stretch">
    <Typography color="muted">
      <LangDisplay text={name} />
    </Typography>
    {accounts.map(account => (
      <Flex
        key={account.name}
        direction="row"
        justify="space-between"
        gap={24}
        py={2}
        px={3}
        $borderRadius={8}
        $borderWidth={1}
      >
        <Flex gap={16} align="center">
          <CoinIcon parentAssetId={account.parentAssetId} size={24} />
          <Flex direction="column">
            <Typography $fontSize={16}>
              <LangDisplay text={account.name} />
            </Typography>
            <Typography color="muted" $fontSize={13}>
              <LangDisplay
                text={truncateMiddle(account.xpubOrAddress, 28, '...')}
              />
            </Typography>
          </Flex>
        </Flex>
        <Typography color="muted" $fontSize={13}>
          <LangDisplay text={getBalanceToDisplay(account)} />
        </Typography>
      </Flex>
    ))}
  </Container>
);

export const WalletConnectAccountConnectedDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const {
    activeWallet,
    activeAccount,
    selectedAccounts,
    handleClose,
    connectionClientMeta,
    version,
  } = useWalletConnect();
  const { buttons, walletConnect } = lang.strings;
  const { accountConnectedTab, common } = walletConnect;
  const groupedAccounts = useMemo(
    () =>
      selectedAccounts.reduce((acc: Record<string, IAccount[]>, account) => {
        acc[account.parentAssetId] = acc[account.parentAssetId] ?? [];
        acc[account.parentAssetId].push(account);
        return acc;
      }, Object.create(null)),
    [selectedAccounts],
  );

  return (
    <DialogBox
      width={500}
      $maxHeight="90vh"
      align="stretch"
      onClose={handleClose}
    >
      <DappConnectionDisplay title={accountConnectedTab.title} connected />
      <ScrollableContainer>
        <DialogBoxBody gap={0} p={0} align="stretch">
          <Container
            px={5}
            pb={4}
            pt={2}
            direction="column"
            align="stretch"
            gap={24}
          >
            <Flex justify="space-between" align="center">
              <Typography $fontWeight="medium" $fontSize={18}>
                <LangDisplay text={accountConnectedTab.subTitle} />
              </Typography>
              <Flex
                $bgColor="popup"
                $borderRadius={8}
                px={2}
                py={1}
                gap={8}
                align="center"
              >
                <WalletIcon width={15} height={12} />
                <Typography $fontSize={12}>
                  <LangDisplay text={activeWallet?.name ?? ''} />
                </Typography>
              </Flex>
            </Flex>
            {version === 2 &&
              Object.keys(groupedAccounts).map(groupKey => {
                const accounts = groupedAccounts[groupKey];
                return (
                  <ConnectAccounts
                    key={groupKey}
                    name={coinList[groupKey].name}
                    accounts={accounts}
                  />
                );
              })}
            {version === 1 && activeAccount && (
              <ConnectAccounts
                name={coinList[
                  activeAccount.parentAssetId
                ].family.toUpperCase()}
                accounts={[activeAccount]}
              />
            )}
            <Container
              display="flex"
              direction="column"
              gap={8}
              py={0}
              px={2}
              width="full"
              align="stretch"
            >
              <Typography color="muted">
                <LangDisplay text={common.info.title} />
              </Typography>
              <BulletList
                items={common.info.points}
                variant="success"
                $bgColor={undefined}
                $borderWidth={0}
                px={0}
                gap={8}
                py={1}
              />
            </Container>
          </Container>
          <Container px={5} pb={4} pt={2} align="stretch">
            <AlertBox
              subAlert={parseLangTemplate(accountConnectedTab.info, {
                dappName: connectionClientMeta?.name,
              })}
              variant="message"
            />
          </Container>
        </DialogBoxBody>
      </ScrollableContainer>
      <DialogBoxFooter>
        <Button
          variant="primary"
          disabled={false}
          onClick={e => {
            e.preventDefault();
            handleClose();
          }}
        >
          <LangDisplay text={buttons.disconnect} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
