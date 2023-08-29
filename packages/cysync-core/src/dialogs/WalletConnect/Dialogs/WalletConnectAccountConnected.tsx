import {
  Button,
  Container,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  LangDisplay,
  Typography,
  UniSwapLogo,
  Image,
  AlertBox,
  BulletList,
  Flex,
  Divider,
  ScrollableContainer,
  DialogBoxHeader,
} from '@cypherock/cysync-ui';
import React from 'react';
import { useWalletConnectDialog } from '../context';
import { selectLanguage, useAppSelector } from '~/store';
import { CoinIcon } from '~/components';
import { IAccount } from '@cypherock/db-interfaces';

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
    <Typography>
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
        <Flex gap={16}>
          <CoinIcon assetId={account.assetId} />
          <Flex direction="column">
            <Typography>
              <LangDisplay text={account.name} />
            </Typography>
            <Typography>
              <LangDisplay text={maskAddress(account.xpubOrAddress)} />
            </Typography>
          </Flex>
        </Flex>
        <Typography>
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

  const { selectedWallet, selectedEvmAccountsGroup, getBalanceToDisplay } =
    useWalletConnectDialog();

  return (
    <DialogBox width={500} $maxHeight="90vh">
      <DialogBoxHeader>
        <Container display="flex" direction="column" gap={32} py={4} px={5}>
          <Image src={UniSwapLogo} alt="Send Coin" />
          <Container display="flex" direction="column" gap={8} width="full">
            <Typography variant="h5" $textAlign="center">
              <LangDisplay text="Connect to Uniswap interface" />
            </Typography>
            <Typography variant="span" color="muted">
              <LangDisplay text="app.uniswap.org" />
            </Typography>
          </Container>
        </Container>
      </DialogBoxHeader>
      <Divider variant="horizontal" />
      <ScrollableContainer>
        <DialogBoxBody pt={4} pb={4} px={0}>
          <Container px={5} direction="column" align="stretch" gap={24}>
            <Flex justify="space-between">
              <Typography>
                <LangDisplay text={accountConnectedTab.title} />
              </Typography>
              <Typography>
                <LangDisplay
                  text={selectedWallet?.name ?? 'No Wallet Selected'}
                />
              </Typography>
            </Flex>
            {selectedEvmAccountsGroup.map(group => (
              <ConnectAccounts
                key={group.assetId}
                name={group.assetId}
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
          >
            <Typography>
              <LangDisplay text={common.info.title} />
            </Typography>
            <BulletList items={common.info.points} />
          </Container>
          <Divider variant="horizontal" />
          <Container px={5}>
            <AlertBox alert={accountConnectedTab.info} variant="warning" />
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
