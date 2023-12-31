// The ReactNodes won't be rendered as list so key is not required
/* eslint-disable react/jsx-key */
import {
  ICoinInfo,
  IEvmErc20Token,
  coinList,
  evmCoinList,
} from '@cypherock/coins';
import { DropDownItemProps } from '@cypherock/cysync-ui';
import { IAccount, IWallet } from '@cypherock/db-interfaces';
import lodash from 'lodash';
import React, {
  Context,
  FC,
  ReactNode,
  createContext,
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

import { CoinIcon } from '~/components';
import { AddTokenCongrats, AddTokenSelectionDialog } from '../Dialogs';

export type AddTokenStatus = 'idle' | 'device' | 'sync' | 'done';

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
  setSelectedTokens: React.Dispatch<React.SetStateAction<ICoinInfo[]>>;
  setSelectedWallet: React.Dispatch<React.SetStateAction<IWallet | undefined>>;
  handleWalletChange: (id?: string) => void;
  setSelectedAccounts: React.Dispatch<React.SetStateAction<IAccount[]>>;
  walletDropdownList: DropDownItemProps[];
  tokenDropDownList: DropDownItemProps[];
  accountDropdownList: DropDownItemProps[];
}

export const AddTokenDialogContext: Context<AddTokenDialogContextInterface> =
  createContext<AddTokenDialogContextInterface>(
    {} as AddTokenDialogContextInterface,
  );

export interface AddTokenDialogContextProviderProps {
  children: ReactNode;
  walletId?: string;
  coinId?: string;
}

export const AddTokenDialogProvider: FC<AddTokenDialogContextProviderProps> = ({
  children,
  walletId: defaultWalletId,
  coinId: defaultCoinId,
}) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();

  const {
    selectedWallet,
    setSelectedWallet,
    handleWalletChange,
    walletDropdownList,
  } = useWalletDropdown({ walletId: defaultWalletId });

  const [selectedTokens, setSelectedTokens] = useState<ICoinInfo[]>(
    defaultCoinId ? [coinList[defaultCoinId]] : [],
  );
  const [selectedAccounts, setSelectedAccounts] = useState<IAccount[]>([]);

  useEffect(() => {
    setSelectedAccounts([]);
  }, [selectedWallet]);

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
    () => Object.fromEntries(accounts.map(a => [a.__id, a]).slice(0, 30)),
    [accounts],
  );

  const { accountDropdownList: accountDropdownListSrc } = useAccountDropdown({
    selectedWallet,
  });
  const accountDropdownList = useMemo(
    () =>
      accountDropdownListSrc.map(a => ({
        ...a,
        shortForm:
          a.id && accountList[a.id]
            ? `(${accountList[a.id].unit.toUpperCase()})`
            : undefined,
        rightText: undefined,
        showRightTextOnBottom: undefined,
      })),
    [accountDropdownListSrc, accountList],
  );

  const tokenDropDownList: DropDownItemProps[] = useMemo<
    DropDownItemProps[]
  >(() => {
    const family = selectedTokens[0]?.family;
    const tokens = Object.values(tokenList);

    return tokens
      .map(token => ({
        id: token.id,
        leftImage: (
          <CoinIcon assetId={token.id} parentAssetId={token.parentId} />
        ),
        shortForm: `(${token.abbr.toUpperCase()})`,
        rightText: `${
          token.parentId[0].toUpperCase() +
          token.parentId.slice(1).toLowerCase()
        }`,
        text: token.name,
        disabled: family ? token.family !== family : false,
      }))
      .sort((a, b) => (!a.disabled && b.disabled ? -1 : 0));
  }, [selectedTokens]);

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
  coinId: undefined,
};

export function useAddTokenDialog(): AddTokenDialogContextInterface {
  return useContext(AddTokenDialogContext);
}
