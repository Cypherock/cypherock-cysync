import { coinList } from '@cypherock/coins';
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
  cysyncLogoSmall,
  DappConnectedLogo,
  Flex,
  CloseButton,
  Divider,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useWalletConnectDialog } from '../context';
import { parseLangTemplate } from '@cypherock/cysync-ui/src';

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
    selectedEvmAccounts,
    handleWalletChange,
    setSelectedEvmAccounts,
    evmAccountsGroup,
    dapp,
    supportedNoAccountBlockchain,
  } = useWalletConnectDialog();

  return (
    <DialogBox width={500} $maxHeight="90vh" align="stretch">
      <Flex direction="row" justify="flex-end" py={2} px={3}>
        <CloseButton onClick={onClose} />
      </Flex>
      <Divider variant="horizontal" />
      <Container display="flex" direction="column" gap={32} py={4} px={5}>
        <DappConnectedLogo
          logos={[dapp.logo, WalletConnectLogo, cysyncLogoSmall]}
        />
        <Container display="flex" direction="column" gap={8} width="full">
          <Typography variant="h5" $textAlign="center">
            <LangDisplay
              text={accountSelectionTab.title}
              variables={{ dappName: dapp.name }}
            />
          </Typography>
          <Typography variant="span" color="muted">
            <LangDisplay text={dapp.url} />
          </Typography>
        </Container>
      </Container>
      <ScrollableContainer>
        <DialogBoxBody pt={2} px={5} pb={4} align="stretch" gap={24}>
          <Dropdown
            items={walletDropdownList}
            selectedItem={selectedWallet?.__id}
            searchText={accountSelectionTab.chooseWallet}
            placeholderText={accountSelectionTab.chooseWallet}
            onChange={handleWalletChange}
            leftImage={
              <Image
                src={walletIcon}
                alt={accountSelectionTab.chooseWallet}
                ml={3}
              />
            }
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
                searchText={parseLangTemplate(
                  accountSelectionTab.chooseAccount,
                  { assetName: coinList[group.assetId].name },
                )}
                placeholderText={parseLangTemplate(
                  accountSelectionTab.chooseAccount,
                  { assetName: coinList[group.assetId].name },
                )}
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
            alert={accountSelectionTab.supportInfo}
            subAlert={supportedNoAccountBlockchain.join(', ')}
            variant="message"
          />
          <AlertBox
            alert={accountSelectionTab.notSupportedWarning.title}
            subAlert={accountSelectionTab.notSupportedWarning.description}
            variant="messageSecondary"
          />
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
          disabled={selectedEvmAccounts.length === 0}
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
