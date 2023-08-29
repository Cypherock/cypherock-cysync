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
  DialogBoxHeader,
} from '@cypherock/cysync-ui';
import React from 'react';
import { useWalletConnectDialog } from '../context';
import { selectLanguage, useAppSelector } from '~/store';
import { coinList } from '@cypherock/coins';

export const WalletConnectAccountSelectionDialog: React.FC = () => {
  const { onNext, onClose } = useWalletConnectDialog();
  const lang = useAppSelector(selectLanguage);
  const { buttons, walletConnect } = lang.strings;
  const { accountSelectionTab, common } = walletConnect;
  const {
    walletDropdownList,
    evmAccountDropdownListGroup,
    selectedWallet,
    selectedEvmAccountsGroup,
    handleWalletChange,
    setSelectedEvmAccounts,
    evmAccountsGroup,
  } = useWalletConnectDialog();

  return (
    <DialogBox width={500} $maxHeight="90vh">
      <DialogBoxHeader>
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
      </DialogBoxHeader>
      <ScrollableContainer>
        <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
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
            {evmAccountDropdownListGroup.map(group => {
              const selectedItem = selectedEvmAccountsGroup.find(
                a => a.assetId === group.assetId,
              )?.accounts[0]?.__id;
              return (
                <Dropdown
                  key={group.assetId}
                  items={group.accounts}
                  selectedItem={selectedItem}
                  disabled={!selectedWallet}
                  searchText={`Select ${coinList[group.assetId].name} Accounts`}
                  placeholderText={`Select ${
                    coinList[group.assetId].name
                  } Accounts`}
                  onChange={id => {
                    // use `handleSelectAccount` & `handleDisselectAccount` for multiselect
                    const selectedAccount = evmAccountsGroup
                      .find(a => a.assetId === group.assetId)
                      ?.accounts.find(a => a.__id === id);
                    if (selectedAccount) {
                      setSelectedEvmAccounts([selectedAccount]);
                    } else {
                      setSelectedEvmAccounts([]);
                    }
                  }}
                />
              );
            })}
            <AlertBox
              alert="These blockchains are supported but add their accounts before use"
              subAlert="Avalanche C-Chain, Solana, Binance"
              variant="message"
            />
            <AlertBox
              alert={accountSelectionTab.notSupportedWarning.title}
              subAlert={accountSelectionTab.notSupportedWarning.description}
              variant="messageSecondary"
            />
            <Typography>
              <LangDisplay text={common.info.title} />
            </Typography>
            <BulletList items={common.info.points} />
          </Container>
        </DialogBoxBody>
      </ScrollableContainer>
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
  );
};
