import { evmCoinList } from '@cypherock/coins';
import {
  Button,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  LangDisplay,
  Typography,
  Dropdown,
  AlertBox,
  BulletList,
  ScrollableContainer,
  Flex,
  CloseButton,
  WalletIcon,
  DialogBoxHeader,
  parseLangTemplate,
} from '@cypherock/cysync-ui';
import { IAccount } from '@cypherock/db-interfaces';
import React, { useEffect, useRef, useState } from 'react';

import { supportedWalletConnectFamilies, useWalletConnect } from '~/context';
import { useAccountDropdown, useWalletDropdown } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import {
  ChainSpecificAccountSelection,
  DappConnectionDisplay,
} from './Components';

export const WalletConnectAccountSelectionDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { buttons, walletConnect } = lang.strings;
  const { accountSelectionTab, common } = walletConnect;
  const { selectedWallet, walletDropdownList, handleWalletChange } =
    useWalletDropdown();
  const { selectedAccount, handleAccountChange, accountDropdownList } =
    useAccountDropdown({
      selectedWallet,
      assetFilter: Object.keys(evmCoinList),
    });
  const {
    requiredNamespaces,
    optionalNamespaces,
    handleClose,
    unsupportedOptionalChainsMessage,
    approveSessionRequest,
    version,
    isApprovingSession,
  } = useWalletConnect();
  const chainToAccountMapRef = useRef<Record<string, IAccount>>({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const onSubmit = (e: any) => {
    e.preventDefault();
    approveSessionRequest(
      version === 1 && selectedAccount
        ? [selectedAccount]
        : Object.values(chainToAccountMapRef.current),
    );
  };

  useEffect(() => {
    if (version === 1) setIsButtonDisabled(selectedAccount === undefined);
  }, [selectedAccount]);

  const updateChainToAccountMap = (account: IAccount, chain: string) => {
    chainToAccountMapRef.current[chain] = account;
    setIsButtonDisabled(
      !requiredNamespaces.every(
        namespace => !!chainToAccountMapRef.current[namespace],
      ),
    );
  };

  return (
    <DialogBox width={500} align="stretch" onClose={handleClose}>
      <DialogBoxHeader height={56} width={500} px={3}>
        <Flex position="relative" width="full" justify="center" align="center">
          <CloseButton
            onClick={handleClose}
            $alignSelf="end"
            position="absolute"
            top={0.5}
            $translateY={-0.5}
            right={0}
          />
        </Flex>
      </DialogBoxHeader>
      <form onSubmit={onSubmit}>
        <DappConnectionDisplay title={accountSelectionTab.title} />
        <ScrollableContainer $maxHeight="calc(90vh - 400px)">
          <DialogBoxBody pt={2} px={5} pb={4} align="stretch" gap={24}>
            <Dropdown
              items={walletDropdownList}
              selectedItem={selectedWallet?.__id}
              searchText={accountSelectionTab.chooseWallet}
              placeholderText={accountSelectionTab.chooseWallet}
              onChange={handleWalletChange}
              leftImage={<WalletIcon ml={3} />}
            />
            {version === 2 && (
              <>
                {requiredNamespaces.map(chain => (
                  <ChainSpecificAccountSelection
                    chain={chain}
                    key={chain}
                    selectedWallet={selectedWallet}
                    updateChainToAccountMap={updateChainToAccountMap}
                    asterisk
                  />
                ))}
                {optionalNamespaces.map(chain => (
                  <ChainSpecificAccountSelection
                    chain={chain}
                    key={chain}
                    selectedWallet={selectedWallet}
                    updateChainToAccountMap={updateChainToAccountMap}
                  />
                ))}
              </>
            )}
            {version === 1 && (
              <Dropdown
                items={accountDropdownList}
                selectedItem={selectedAccount?.__id}
                disabled={!selectedWallet}
                searchText={`${parseLangTemplate(
                  accountSelectionTab.chooseAccount,
                  {
                    assetName: supportedWalletConnectFamilies[0].toUpperCase(),
                  },
                )}*`}
                placeholderText={`${parseLangTemplate(
                  accountSelectionTab.chooseAccount,
                  {
                    assetName: supportedWalletConnectFamilies[0].toUpperCase(),
                  },
                )}*`}
                onChange={handleAccountChange}
              />
            )}
            {unsupportedOptionalChainsMessage && (
              <AlertBox
                alert={accountSelectionTab.notSupportedWarning.title}
                subAlert={unsupportedOptionalChainsMessage}
                variant="messageSecondary"
              />
            )}
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
            onClick={e => {
              e.preventDefault();
              handleClose();
            }}
          >
            <LangDisplay text={buttons.reject} />
          </Button>
          <Button
            variant="primary"
            disabled={isApprovingSession || isButtonDisabled}
            isLoading={isApprovingSession}
            type="submit"
          >
            <LangDisplay text={buttons.connect} />
          </Button>
        </DialogBoxFooter>
      </form>
    </DialogBox>
  );
};
