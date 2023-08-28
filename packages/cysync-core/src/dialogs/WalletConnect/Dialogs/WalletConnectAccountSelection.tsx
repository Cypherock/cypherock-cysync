import {
  Button,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  LangDisplay,
  Typography,
  Container,
  Image,
  WalletConnectLogo,
  walletIcon,
  Dropdown,
  AlertBox,
  BulletList,
  ScrollableContainer,
} from '@cypherock/cysync-ui';
import React from 'react';
import { useWalletConnectDialog } from '../context';
import { selectLanguage, useAppSelector } from '~/store';

export const WalletConnectAccountSelectionDialog: React.FC = () => {
  const { onNext, onClose } = useWalletConnectDialog();
  const lang = useAppSelector(selectLanguage);
  const { buttons, walletConnect } = lang.strings;
  const { accountSelectionTab, common } = walletConnect;
  const {
    walletDropdownList,
    accountDropdownList,
    selectedWallet,
    selectedAccount,
    handleWalletChange,
    handleAccountChange,
  } = useWalletConnectDialog();

  return (
    /** @doubt How to best deal with text overflow? */
    <ScrollableContainer $maxHeight="90vh">
      <DialogBox width={500}>
        <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
          <Container display="flex" direction="column" gap={32} py={4}>
            <Image src={WalletConnectLogo} alt="Send Coin" />
            <Container display="flex" direction="column" gap={8} width="full">
              <Typography variant="h5" $textAlign="center">
                <LangDisplay text="Connect to Uniswap interface" />
              </Typography>
              <Typography variant="span" color="muted">
                <LangDisplay text="app.uniswap.org" />
              </Typography>
            </Container>
          </Container>
          <Container
            display="flex"
            direction="column"
            gap={24}
            py={2}
            width="full"
          >
            <Dropdown
              items={walletDropdownList}
              selectedItem={selectedWallet?.__id}
              searchText="Choose Wallet"
              placeholderText="Choose Wallet"
              onChange={handleWalletChange}
              leftImage={<Image src={walletIcon} alt="wallet icon" ml={3} />}
            />
            {/** @doubt How to Ethereum/Polygon Accounts? */}
            <Dropdown
              items={accountDropdownList}
              selectedItem={selectedAccount?.__id}
              disabled={!selectedWallet}
              searchText="Select Ethereum Accounts"
              placeholderText="Select Ethereum Accounts*"
              onChange={handleAccountChange}
            />
            <Dropdown
              items={accountDropdownList}
              selectedItem={selectedAccount?.__id}
              disabled={!selectedWallet}
              searchText="Select Polygon Accounts"
              placeholderText="Select Polygon Accounts"
              onChange={handleAccountChange}
            />
            <AlertBox
              alert="These blockchains are supported but add their accounts before use: Avalanche C-Chain, Solana, Binance"
              variant="info"
            />
            <AlertBox
              alert={`${accountSelectionTab.notSupportedWarning.title}: ${accountSelectionTab.notSupportedWarning.description}`}
              variant="warning"
            />
            <Typography>
              <LangDisplay text={common.info.title} />
            </Typography>
            <BulletList items={common.info.points} />
          </Container>
        </DialogBoxBody>
        <DialogBoxFooter>
          <Button
            variant="secondary"
            disabled={false}
            onClick={e => {
              e.preventDefault();
              onClose();
            }}
          >
            <LangDisplay text={buttons.reject} />
          </Button>
          <Button
            variant="primary"
            disabled={!selectedWallet}
            onClick={e => {
              e.preventDefault();
              onNext();
            }}
          >
            <LangDisplay text={buttons.connect} />
          </Button>
        </DialogBoxFooter>
      </DialogBox>
    </ScrollableContainer>
  );
};
