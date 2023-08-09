import { coinList } from '@cypherock/coins';
import {
  LangDisplay,
  DialogBox,
  DialogBoxBody,
  Typography,
  Container,
  DialogBoxFooter,
  Button,
  Dropdown,
  DropDownListItemProps,
  svgGradients,
  ArrowReceivedIcon,
  WalletIcon,
} from '@cypherock/cysync-ui';
import { createSelector } from '@reduxjs/toolkit';
import React, { useMemo } from 'react';
import { useTheme } from 'styled-components';

import { CoinIcon } from '~/components';
import {
  selectAccounts,
  selectLanguage,
  selectWallets,
  useAppSelector,
} from '~/store';

import { useReceiveDialog } from '../context';

const selectLangWalletAccount = createSelector(
  [selectLanguage, selectWallets, selectAccounts],
  (a, b, c) => ({ lang: a, ...b, ...c }),
);

export const SelectionDialog: React.FC = () => {
  const { lang, wallets, accounts } = useAppSelector(selectLangWalletAccount);
  const theme = useTheme()!;

  const {
    onNext,
    selectedAccount,
    selectedWallet,
    setSelectedAccount,
    setSelectedWallet,
  } = useReceiveDialog();

  const handleWalletChange = (id?: string) => {
    if (!id) setSelectedWallet(undefined);
    setSelectedWallet(wallets.find(w => w.__id === id));
  };

  const handleAccountChange = (id?: string) => {
    if (!id) {
      setSelectedAccount(undefined);
      return;
    }
    setSelectedAccount(accounts.find(a => a.__id === id));
  };

  const walletDropdownList: DropDownListItemProps[] = useMemo(
    () =>
      wallets.map(w => ({
        id: w.__id,
        text: w.name,
        checkType: 'radio',
        leftImage: (
          <WalletIcon fill={theme.palette.text.white} width={20} height={20} />
        ),
      })),
    [wallets],
  );

  const accountDropdownList: DropDownListItemProps[] = useMemo(
    () =>
      accounts
        .filter(account => account.walletId === selectedWallet?.__id)
        .map(account => ({
          id: account.__id,
          checkType: 'radio',
          leftImage: <CoinIcon assetId={account.assetId} />,
          text: account.name,
          shortForm: `(${coinList[account.assetId].abbr})`,
          tag: account.derivationScheme?.toUpperCase(),
          rightText: `${account.balance} ${account.unit}`,
        })),
    [accounts, selectedWallet],
  );
  const dialogText = lang.strings.receive.source;
  const buttonText = lang.strings.buttons;

  return (
    <DialogBox width={500}>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <ArrowReceivedIcon
          height={48}
          width={56}
          fill={`url(#${svgGradients.gold})`}
        />
        <Container display="flex" direction="column" gap={20} width="full">
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={dialogText.title} />
          </Typography>
          <Typography
            variant="span"
            $textAlign="center"
            $fontSize={14}
            $fontWeight="normal"
            color="muted"
          >
            <LangDisplay text={dialogText.subtitle} />
          </Typography>
        </Container>
        <Container display="flex" direction="column" gap={20} width="full">
          <Dropdown
            items={walletDropdownList}
            selectedItem={selectedWallet?.__id}
            searchText={dialogText.searchText}
            placeholderText={dialogText.walletPlaceholder}
            onChange={handleWalletChange}
          />
          <Dropdown
            items={accountDropdownList}
            selectedItem={selectedAccount?.__id}
            disabled={!selectedWallet}
            searchText={dialogText.searchText}
            placeholderText={dialogText.accountPlaceholder}
            onChange={handleAccountChange}
            shouldShowIcon
          />
        </Container>
      </DialogBoxBody>

      <DialogBoxFooter>
        <Button
          variant="primary"
          disabled={!selectedAccount || !selectedWallet}
          onClick={e => {
            e.preventDefault();
            onNext();
          }}
        >
          <LangDisplay text={buttonText.continue} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
