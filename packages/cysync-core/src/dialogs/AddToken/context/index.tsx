// The ReactNodes won't be rendered as list so key is not required
/* eslint-disable react/jsx-key */
import {
  getAsset,
  unhideOrInsertAccountIfNotExists,
} from '@cypherock/coin-support-utils';
import {
  ICoinInfo,
  IEvmErc20Token,
  coinFamiliesMap,
  evmCoinList,
} from '@cypherock/coins';
import { DropDownItemProps } from '@cypherock/cysync-ui';
import { AccountTypeMap, IAccount, IWallet } from '@cypherock/db-interfaces';
import {createSelector} from '@reduxjs/toolkit';
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

import { syncAccounts, syncPriceHistories, syncPrices } from '~/actions';
import { CoinIcon } from '~/components';
import { ITabs, useAccountDropdown, useTabsAndDialogs } from '~/hooks';
import { useWalletDropdown } from '~/hooks/useWalletDropdown';
import {
  closeDialog,
  selectLanguage,
  selectUnHiddenAccounts,
  useAppDispatch,
  useShallowEqualAppSelector,
} from '~/store';
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
  selectedChainNameWithNoAccount: string | undefined;
  defaultWalletId?: string;
}

export const AddTokenDialogContext: Context<AddTokenDialogContextInterface> =
  createContext<AddTokenDialogContextInterface>(
    {} as AddTokenDialogContextInterface,
  );

export interface AddTokenDialogContextProviderProps {
  children: ReactNode;
  walletId?: string;
}

const selector = createSelector(
  [selectUnHiddenAccounts, selectLanguage],
  ({ accounts }, lang) => ({
    accounts,
    lang,
  }),
);

export const AddTokenDialogProvider: FC<AddTokenDialogContextProviderProps> = ({
  children,
  walletId: defaultWalletId,
}) => {
  const { accounts, lang } = useShallowEqualAppSelector(selector);
  const dispatch = useAppDispatch();

  const {
    selectedWallet,
    setSelectedWallet,
    handleWalletChange,
    walletDropdownList,
  } = useWalletDropdown({ walletId: defaultWalletId });

  const [selectedChain, setSelectedChain] = useState<string | undefined>(
    undefined,
  );
  const [selectedTokens, setSelectedTokens] = useState<IEvmErc20Token[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<IAccount[]>([]);

  useEffect(() => {
    setSelectedAccounts([]);
  }, [selectedWallet]);

  useEffect(() => {
    if (selectedTokens.length > 0) setSelectedChain(selectedTokens[0].parentId);
    else if (selectedAccounts.length > 0)
      setSelectedChain(selectedAccounts[0].assetId);
    else setSelectedChain(undefined);
  }, [selectedTokens, selectedAccounts]);

  useEffect(() => {
    if (selectedTokens.length === 0) setSelectedAccounts([]);
  }, [selectedTokens.length]);

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> =
    useMemo(
      () => ({
        1: [0],
      }),
      [],
    );

  const tabs: ITabs = useMemo(
    () => [
      {
        name: lang.strings.addToken.header,
        dialogs: [<AddTokenSelectionDialog />],
      },
      {
        name: '',
        dialogs: [<AddTokenCongrats />],
      },
    ],
    [lang],
  );

  const { onNext, onPrevious, goTo, currentTab, currentDialog } =
    useTabsAndDialogs({
      deviceRequiredDialogsMap,
      tabs,
      dialogName: 'addToken',
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
        .map(a => {
          const account = a.id ? accountList[a.id] : undefined;
          const shortForm = account
            ? getAsset(account.parentAssetId, account.assetId).abbr
            : undefined;

          return {
            ...a,
            shortForm,
            rightText: undefined,
            showRightTextOnBottom: undefined,
            disabled:
              account !== undefined &&
              selectedChain !== undefined &&
              selectedChain !== account.assetId,
          };
        }),
    [accountDropdownListSrc, accountList, selectedChain],
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
      disabled: selectedChain !== undefined && selectedChain !== token.parentId,
    }));
  }, [tokenList, selectedChain]);

  const selectedChainNameWithNoAccount = useMemo<string | undefined>(() => {
    if (selectedChain === undefined) return undefined;

    if (
      accountDropdownListSrc.find(a => {
        const account = a.id ? accountList[a.id] : undefined;
        if (account?.assetId === selectedChain) return true;
        return false;
      })
    )
      return undefined;

    return (
      selectedChain[0].toUpperCase() + selectedChain.slice(1).toLowerCase()
    );
  }, [selectedChain, accountDropdownListSrc]);

  const handleCreateToken = useCallback(async () => {
    if (selectedAccounts.length === 0 || selectedTokens.length === 0) {
      return;
    }

    const tokenAccountEntries: Awaited<
      ReturnType<typeof unhideOrInsertAccountIfNotExists>
    >[] = [];

    const db = getDB();
    // eslint-disable-next-line no-plusplus
    for (let ai = 0; ai < selectedAccounts.length; ++ai) {
      const account = selectedAccounts[ai];
      // eslint-disable-next-line no-plusplus
      for (let ti = 0; ti < selectedTokens.length; ++ti) {
        const token = selectedTokens[ti];
        try {
          const tokenAccountEntry = await unhideOrInsertAccountIfNotExists(db, {
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
            isHidden: false,
          });
          tokenAccountEntries.push(tokenAccountEntry);
        } catch (err) {
          logger.error(err);
        }
      }
    }

    const unHiddenOrNewTokenAccounts = tokenAccountEntries
      .filter(entry => entry.isInserted || entry.isUnHidden)
      .map(entry => entry.account);

    if (unHiddenOrNewTokenAccounts.length > 0) {
      syncPrices({ families: [coinFamiliesMap.evm] }).catch(logger.error);
      syncPriceHistories({ families: [coinFamiliesMap.evm] }).catch(
        logger.error,
      );
      dispatch(syncAccounts({ accounts: unHiddenOrNewTokenAccounts }));
    }

    onNext();
  }, [selectedAccounts, selectedTokens]);

  const ctx = useMemo(
    () => ({
      defaultWalletId,
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
      selectedChainNameWithNoAccount,
    }),
    [
      defaultWalletId,
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
      selectedChainNameWithNoAccount,
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
