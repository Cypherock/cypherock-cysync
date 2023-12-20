import { DropDownItemProps, WalletIcon, useTheme } from '@cypherock/cysync-ui';
import { IWallet } from '@cypherock/db-interfaces';
import { createSelector } from '@reduxjs/toolkit';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { selectLanguage, selectWallets, useAppSelector } from '..';

export interface UseWalletDropdownProps {
  walletId?: string;
  withSelectAll?: boolean;
  dropdownWidth?: number;
}

const selector = createSelector(
  [selectLanguage, selectWallets],
  (lang, { wallets }) => ({ lang, wallets }),
);

export const useWalletDropdown = (props?: UseWalletDropdownProps) => {
  const [selectedWallet, setSelectedWallet] = useState<IWallet | undefined>();
  const { wallets, lang } = useAppSelector(selector);
  const theme = useTheme();

  const handleWalletChange = useCallback(
    (id?: string) => {
      if (!id) setSelectedWallet(undefined);
      setSelectedWallet(wallets.find(w => w.__id === id));
    },
    [wallets],
  );

  const walletDropdownList: DropDownItemProps[] = useMemo(() => {
    const $textMaxWidth = props?.dropdownWidth
      ? `${props.dropdownWidth - 100}px`
      : undefined;
    const $textMaxWidthWhenSelected = props?.dropdownWidth
      ? `${props.dropdownWidth - 100}px`
      : undefined;

    const defaultProps = {
      checkType: 'radio',
      $textMaxWidth,
      $textMaxWidthWhenSelected,
    } as const;

    const list: DropDownItemProps[] = wallets.map(w => ({
      ...defaultProps,
      id: w.__id ?? '',
      text: w.name,
      leftImage: (
        <WalletIcon fill={theme.palette.text.white} width={20} height={20} />
      ),
    }));

    if (props?.withSelectAll) {
      list.unshift({
        ...defaultProps,
        id: 'all',
        text: lang.strings.allWallets,
        leftImage: (
          <WalletIcon fill={theme.palette.text.white} width={20} height={20} />
        ),
      });
    }

    return list;
  }, [wallets, props?.dropdownWidth]);

  useEffect(() => {
    if (props?.walletId) {
      const wallet = wallets.find(w => w.__id === props.walletId);

      setSelectedWallet(wallet);
    }
  }, [props?.walletId]);

  return {
    selectedWallet,
    setSelectedWallet,
    handleWalletChange,
    walletDropdownList,
  };
};
