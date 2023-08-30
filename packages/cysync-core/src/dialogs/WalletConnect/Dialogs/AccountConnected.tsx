import { coinList } from '@cypherock/coins';
import {
  Button,
  Container,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  LangDisplay,
  Typography,
  Image,
  AlertBox,
  BulletList,
  Flex,
  Divider,
  ScrollableContainer,
  DialogBoxHeader,
  WalletIcon,
} from '@cypherock/cysync-ui';
import { IAccount } from '@cypherock/db-interfaces';
import React from 'react';

import { CoinIcon } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

import { useWalletConnectDialog } from '../context';

interface ConnectAccountParam {
  name: string;
  accounts: IAccount[];
  getBalanceToDisplay: (account: IAccount) => string;
}

const maskAddress = (address: string, len = 12) =>
  `${address.slice(0, len)}...${address.slice(-len)}`;

const ConnectAccounts: React.FC<ConnectAccountParam> = ({
  name,
  accounts,
  getBalanceToDisplay,
}) => (
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
          <CoinIcon assetId={account.assetId} size={24} />
          <Flex direction="column">
            <Typography $fontSize={16}>
              <LangDisplay text={account.name} />
            </Typography>
            <Typography color="muted" $fontSize={13}>
              <LangDisplay text={maskAddress(account.xpubOrAddress)} />
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
  const { onClose } = useWalletConnectDialog();
  const lang = useAppSelector(selectLanguage);
  const { buttons, walletConnect } = lang.strings;
  const { accountConnectedTab, common } = walletConnect;

  const {
    selectedWallet,
    selectedEvmAccountsGroup,
    getBalanceToDisplay,
    dapp,
  } = useWalletConnectDialog();

  return (
    <DialogBox width={500} $maxHeight="90vh">
      <DialogBoxHeader>
        <Container display="flex" direction="column" gap={32} py={4} px={5}>
          <Image src={dapp.logo} alt="Send Coin" />
          <Container display="flex" direction="column" gap={8} width="full">
            <Typography variant="h5" $textAlign="center">
              <LangDisplay
                text={accountConnectedTab.title}
                variables={{ dappName: dapp.name }}
              />
            </Typography>
            <Typography variant="span" color="muted">
              <LangDisplay text={dapp.url} />
            </Typography>
          </Container>
        </Container>
      </DialogBoxHeader>
      <Divider variant="horizontal" />
      <ScrollableContainer>
        <DialogBoxBody pt={4} pb={4} px={0} align="stretch">
          <Container px={5} direction="column" align="stretch" gap={24}>
            <Flex justify="space-between">
              <Typography $fontWeight="bold">
                <LangDisplay text={accountConnectedTab.subTitle} />
              </Typography>
              <Flex $bgColor="input" px={2} py={1} gap={8} align="center">
                <WalletIcon width={15} height={12} />
                {/* <Image src={WalletIcon} alt={selectedWallet?.name ?? 'No Wallet Selected'} /> */}
                <Typography $fontSize={12}>
                  <LangDisplay text={selectedWallet?.name ?? ''} />
                </Typography>
              </Flex>
            </Flex>
            {selectedEvmAccountsGroup.map(group => (
              <ConnectAccounts
                key={group.assetId}
                name={coinList[group.assetId].name}
                accounts={group.accounts}
                getBalanceToDisplay={getBalanceToDisplay}
              />
            ))}
          </Container>
          <Container
            display="flex"
            direction="column"
            gap={24}
            py={2}
            px={5}
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
              py={0}
            />
          </Container>
          <Divider variant="horizontal" />
          <Container px={5}>
            <AlertBox subAlert={accountConnectedTab.info} variant="message" />
          </Container>
        </DialogBoxBody>
      </ScrollableContainer>
      <DialogBoxFooter>
        <Button
          variant="primary"
          disabled={false}
          onClick={e => {
            e.preventDefault();
            onClose();
          }}
        >
          <LangDisplay text={buttons.disconnect} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};