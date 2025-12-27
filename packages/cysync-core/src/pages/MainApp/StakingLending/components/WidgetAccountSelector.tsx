import {
  Button,
  Container,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  DialogBoxHeader,
  Dropdown,
  Flex,
  LangDisplay,
  Typography,
  WalletIcon,
  CloseButton,
  AlertBox,
} from '@cypherock/cysync-ui';
import { IAccount, IWallet } from '@cypherock/db-interfaces';
import React, { useCallback } from 'react';

import { useAccountDropdown, useWalletDropdown } from '~/hooks';
import { useAppSelector, selectAccounts } from '~/store';
import { evmCoinList } from '@cypherock/coins';
import logger from '~/utils/logger';

export interface WidgetAccountSelectorProps {
  onAccountSelected: (account: IAccount, wallet: IWallet) => void;
  onClose: () => void;
  isConnecting?: boolean;
}

export const WidgetAccountSelector: React.FC<WidgetAccountSelectorProps> = ({
  onAccountSelected,
  onClose,
  isConnecting,
}) => {
  const { accounts: allAccounts } = useAppSelector(selectAccounts);

  const { selectedWallet, walletDropdownList, handleWalletChange } =
    useWalletDropdown();
  const { selectedAccount, handleAccountChange, accountDropdownList } =
    useAccountDropdown({
      selectedWallet,
      assetFilter: Object.keys(evmCoinList),
    });

  const isValid = selectedWallet && selectedAccount;

  const handleWalletChangeProxy: typeof handleWalletChange = useCallback(
    (...args) => {
      logger.info('Widget Account Selection: Wallet Changed', {
        source: 'WidgetAccountSelector',
        isWalletSelected: Boolean(args[0]),
      });
      return handleWalletChange(...args);
    },
    [handleWalletChange],
  );

  const handleAccountChangeProxy: typeof handleAccountChange = useCallback(
    (id: string | undefined, ...args) => {
      const targetAccount = allAccounts.find(a => a.__id === id);
      logger.info('Widget Account Selection: Account Changed', {
        source: 'WidgetAccountSelector',
        assetId: targetAccount?.assetId,
        derivationPath: targetAccount?.derivationPath,
      });
      return handleAccountChange(id, ...args);
    },
    [allAccounts, handleAccountChange],
  );

  const handleConnect = () => {
    if (selectedWallet && selectedAccount) {
      logger.info('Widget Account Selection: Connecting to P2P Widget', {
        wallet: selectedWallet.name,
        account: selectedAccount.name,
      });
      onAccountSelected(selectedAccount, selectedWallet);
    }
  };

  return (
    <DialogBox width={500} onClose={onClose}>
      <DialogBoxHeader height={56} width={500} px={3}>
        <Flex position="relative" width="full" justify="center" align="center">
          <Typography variant="h5" $textAlign="center">
            Staking & Lending
          </Typography>
          <CloseButton
            onClick={onClose}
            $alignSelf="end"
            position="absolute"
            top={0.5}
            $translateY={-0.5}
            right={0}
          />
        </Flex>
      </DialogBoxHeader>

      <DialogBoxBody py={4} px={5} gap={24} align="stretch">
        {/* Header Section */}
        <Container direction="column" gap={8} align="center">
          <Typography variant="h6" $textAlign="center">
            Select Account for P2P Staking & Lending
          </Typography>
        </Container>

        {/* Wallet Selection */}
        <Container direction="column" gap={3}>
          <Typography $fontSize={14} $fontWeight="medium">
            Select Wallet
          </Typography>
          <Dropdown
            items={walletDropdownList}
            selectedItem={selectedWallet?.__id}
            searchText="Choose Wallet"
            placeholderText="Choose Wallet"
            onChange={handleWalletChangeProxy}
            leftImage={<WalletIcon ml={3} />}
            disabled={isConnecting}
          />
        </Container>

        {/* Account Selection */}
        <Container direction="column" gap={3}>
          <Typography $fontSize={14} $fontWeight="medium">
            Select Account
          </Typography>
          <Dropdown
            items={accountDropdownList}
            selectedItem={selectedAccount?.__id}
            disabled={!selectedWallet || isConnecting}
            searchText="Choose Account"
            placeholderText="Choose Account"
            onChange={handleAccountChangeProxy}
          />
        </Container>

        {/* No Accounts Message */}
        {selectedWallet && accountDropdownList.length === 0 && (
          <AlertBox
            variant="messageSecondary"
            alert="No ETH Accounts Found"
            subAlert="This wallet doesn't have any Ethereum accounts. Please add an ETH account first."
          />
        )}
      </DialogBoxBody>

      <DialogBoxFooter>
        <Button variant="secondary" onClick={onClose}>
          <LangDisplay text="Cancel" />
        </Button>
        <Button
          variant="primary"
          disabled={!isValid || isConnecting}
          isLoading={isConnecting}
          onClick={handleConnect}
        >
          <LangDisplay
            text={isConnecting ? 'Connecting...' : 'Connect & Start'}
          />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};

WidgetAccountSelector.defaultProps = {
  isConnecting: false,
};
