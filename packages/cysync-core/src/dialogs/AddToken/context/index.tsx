// The ReactNodes won't be rendered as list so key is not required
/* eslint-disable react/jsx-key */
import {
  ICoinInfo,
  IEvmErc20Token,
  coinFamiliesMap,
  evmCoinList,
} from '@cypherock/coins';
import { DropDownItemProps } from '@cypherock/cysync-ui';
import { AccountTypeMap, IAccount, IWallet } from '@cypherock/db-interfaces';
import lodash from 'lodash';

import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { ITabs, useAccountDropdown, useTabsAndDialogs } from '~/hooks';
import { useWalletDropdown } from '~/hooks/useWalletDropdown';
import {
  closeDialog,
  selectAccounts,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import { insertAccountIfNotExists } from '@cypherock/coin-support-utils';
import { syncAccounts, syncPriceHistories, syncPrices } from '~/actions';
import { CoinIcon } from '~/components';
import { getDB } from '~/utils';
import logger from '~/utils/logger';
import { AddTokenCongrats, AddTokenSelectionDialog } from '../Dialogs';

export interface AddTokenDialogContextInterface {
  currentTab: number;
  currentDialog: number;
  tabs: ITabs;
  onNext: () => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  tokenList: Record<string, IEvmErc20Token>;
  accountList: Record<string, IAccount>;
  selectedTokens: ICoinInfo[];
  selectedWallet: IWallet | undefined;
  selectedAccounts: IAccount[];
  setSelectedTokens: React.Dispatch<React.SetStateAction<IEvmErc20Token[]>>;
  setSelectedWallet: React.Dispatch<React.SetStateAction<IWallet | undefined>>;
  handleWalletChange: (id?: string) => void;
  setSelectedAccounts: React.Dispatch<React.SetStateAction<IAccount[]>>;
  walletDropdownList: DropDownItemProps[];
  tokenDropDownList: DropDownItemProps[];
  accountDropdownList: DropDownItemProps[];
  handleCreateToken: () => void;
}

export const AddTokenDialogContext: Context<AddTokenDialogContextInterface> =
  createContext<AddTokenDialogContextInterface>(
    {} as AddTokenDialogContextInterface,
  );

export interface AddTokenDialogContextProviderProps {
  children: ReactNode;
  walletId?: string;
}

export const AddTokenDialogProvider: FC<AddTokenDialogContextProviderProps> = ({
  children,
  walletId: defaultWalletId,
}) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();

  const {
    selectedWallet,
    setSelectedWallet,
    handleWalletChange,
    walletDropdownList,
  } = useWalletDropdown({ walletId: defaultWalletId });

  const [selectedAssetType, setSelectedAssetType] = useState<
    string | undefined
  >(undefined);
  const [selectedTokens, setSelectedTokens] = useState<IEvmErc20Token[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<IAccount[]>([]);

  useEffect(() => {
    setSelectedAccounts([]);
  }, [selectedWallet]);

  useEffect(() => {
    if (selectedTokens.length > 0)
      setSelectedAssetType(selectedTokens[0].parentId);
    else if (selectedAccounts.length > 0)
      setSelectedAssetType(selectedAccounts[0].assetId);
    else setSelectedAssetType(undefined);
  }, [selectedTokens, selectedAccounts]);

  useEffect(() => {
    if (selectedTokens.length === 0) setSelectedAccounts([]);
  }, [selectedTokens.length]);

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {
    1: [0],
  };

  const tabs: ITabs = [
    {
      name: lang.strings.addToken.header,
      dialogs: [<AddTokenSelectionDialog />],
    },
    {
      name: '',
      dialogs: [<AddTokenCongrats />],
    },
  ];

  const { onNext, onPrevious, goTo, currentTab, currentDialog } =
    useTabsAndDialogs({
      deviceRequiredDialogsMap,
      tabs,
    });

  const onClose = () => {
    dispatch(closeDialog('addToken'));
  };

  const tokenList: Record<string, IEvmErc20Token> = useMemo(
    () =>
      Object.fromEntries(
        lodash
          .concat(
            ...Object.values(evmCoinList)
              .filter(
                c =>
                  window.cysyncEnv.IS_PRODUCTION === 'false' ||
                  !c.isUnderDevelopment,
              )
              .map(coin => Object.values(coin.tokens)),
          )
          .map(token => [token.id, token]),
      ),
    [],
  );

  const { accounts } = useAppSelector(selectAccounts);
  const accountList: Record<string, IAccount> = useMemo(
    () => Object.fromEntries(accounts.map(a => [a.__id, a])),
    [accounts],
  );

  const { accountDropdownList: accountDropdownListSrc } = useAccountDropdown({
    selectedWallet,
  });
  const accountDropdownList = useMemo(
    () =>
      accountDropdownListSrc
        .filter(a => Boolean(a.id && accountList[a.id]))
        .map(a => ({
          ...a,
          shortForm:
            a.id === undefined
              ? undefined
              : `(${accountList[a.id].unit.toUpperCase()})`,
          rightText: undefined,
          showRightTextOnBottom: undefined,
          disabled:
            a.id !== undefined &&
            selectedAssetType !== undefined &&
            selectedAssetType !== accountList[a.id].assetId,
        })),
    [accountDropdownListSrc, accountList, selectedAssetType],
  );

  const tokenDropDownList: DropDownItemProps[] = useMemo<
    DropDownItemProps[]
  >(() => {
    const tokens = Object.values(tokenList);

    return tokens.map(token => ({
      id: token.id,
      leftImage: <CoinIcon assetId={token.id} parentAssetId={token.parentId} />,
      shortForm: `(${token.abbr.toUpperCase()})`,
      rightText:
        token.parentId[0].toUpperCase() + token.parentId.slice(1).toLowerCase(),
      text: token.name,
      disabled:
        selectedAssetType !== undefined && selectedAssetType !== token.parentId,
    }));
  }, [tokenList, selectedAssetType]);

  const handleCreateToken = useCallback(async () => {
    if (selectedAccounts.length === 0 || selectedTokens.length === 0) {
      return;
    }

    const tokenAccountEntries: Awaited<
      ReturnType<typeof insertAccountIfNotExists>
    >[] = [];

    const db = getDB();
    // eslint-disable-next-line no-plusplus
    for (let ai = 0; ai < selectedAccounts.length; ++ai) {
      const account = selectedAccounts[ai];
      // eslint-disable-next-line no-plusplus
      for (let ti = 0; ti < selectedTokens.length; ++ti) {
        const token = selectedTokens[ti];
        const tokenAccountEntry = await insertAccountIfNotExists(db, {
          walletId: account.walletId,
          assetId: token.id,
          familyId: account.familyId,
          parentAccountId: account.__id ?? '',
          parentAssetId: account.assetId,
          type: AccountTypeMap.subAccount,
          name: token.name,
          derivationPath: account.derivationPath,
          unit: token.units[0].abbr,
          xpubOrAddress: account.xpubOrAddress,
          balance: '0',
        });
        tokenAccountEntries.push(tokenAccountEntry);
      }
    }

    const newTokenAccounts = tokenAccountEntries
      .filter(entry => entry.isInserted)
      .map(entry => entry.account);

    if (newTokenAccounts.length > 0) {
      syncPrices({ families: [coinFamiliesMap.evm] }).catch(logger.error);
      syncPriceHistories({ families: [coinFamiliesMap.evm] }).catch(
        logger.error,
      );
      dispatch(syncAccounts({ accounts: newTokenAccounts }));
    }

    onNext();
  }, [selectedAccounts, selectedTokens]);

  const ctx = useMemo(
    () => ({
      currentTab,
      currentDialog,
      tabs,
      onNext,
      goTo,
      onPrevious,
      onClose,
      tokenList,
      accountList,
      selectedTokens,
      selectedWallet,
      setSelectedTokens,
      setSelectedWallet,
      handleWalletChange,
      walletDropdownList,
      tokenDropDownList,
      accountDropdownList,
      selectedAccounts,
      setSelectedAccounts,
      handleCreateToken,
    }),
    [
      currentTab,
      currentDialog,
      tabs,
      onNext,
      goTo,
      onPrevious,
      onClose,
      tokenList,
      accountList,
      selectedTokens,
      selectedWallet,
      setSelectedTokens,
      setSelectedWallet,
      handleWalletChange,
      walletDropdownList,
      tokenDropDownList,
      accountDropdownList,
      selectedAccounts,
      setSelectedAccounts,
      handleCreateToken,
    ],
  );

  return (
    <AddTokenDialogContext.Provider value={ctx}>
      {children}
    </AddTokenDialogContext.Provider>
  );
};

AddTokenDialogProvider.defaultProps = {
  walletId: undefined,
};

export function useAddTokenDialog(): AddTokenDialogContextInterface {
  return useContext(AddTokenDialogContext);
}
