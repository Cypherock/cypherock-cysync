import { updateAccount } from '@cypherock/coin-support-utils';
import { coinList } from '@cypherock/coins';
import { DropDownItemProps } from '@cypherock/cysync-ui';
import { IAccount, IWallet } from '@cypherock/db-interfaces';
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

import { useAccountDropdown, useWalletDropdown } from '~/hooks';
import { ITabs, useTabsAndDialogs } from '~/hooks/useTabsAndDialogs';
import {
  closeDialog,
  openSnackBar,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import { getDB } from '~/utils';

import { EditAccountDialogProps } from '..';
import {
  AccountDetails,
  AccountSelection,
  DeleteAccountDialog,
} from '../Dialogs';

export interface EditAccountDialogContextInterface {
  tabs: ITabs;
  onNext: (tab?: number, dialog?: number) => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  currentTab: number;
  currentDialog: number;
  isDeviceRequired: boolean;
  onClose: () => void;
  selectedWallet: IWallet | undefined;
  setSelectedWallet: React.Dispatch<React.SetStateAction<IWallet | undefined>>;
  selectedAccount: IAccount | undefined;
  setSelectedAccount: React.Dispatch<
    React.SetStateAction<IAccount | undefined>
  >;
  walletDropdownList: DropDownItemProps[];
  handleWalletChange: (id?: string | undefined) => void;
  accountDropdownList: DropDownItemProps[];
  handleAccountChange: (id?: string | undefined) => void;
  accountName: string;
  handleAccountNameChange: React.Dispatch<React.SetStateAction<string>>;
  onApply: () => void;
  unitDropdownList: DropDownItemProps[];
  setSelectedUnit: React.Dispatch<React.SetStateAction<string | undefined>>;
  selectedUnit: string | undefined;
}

export const EditAccountDialogContext: Context<EditAccountDialogContextInterface> =
  createContext<EditAccountDialogContextInterface>(
    {} as EditAccountDialogContextInterface,
  );

export interface EditAccountDialogContextProviderProps
  extends EditAccountDialogProps {
  children: ReactNode;
}

export const EditAccountDialogProvider: FC<
  EditAccountDialogContextProviderProps
> = ({
  children,
  walletId: defaultWalletId,
  accountId: defaultAccountId,
  isSkipAccountSelection = false,
}) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();

  const {
    selectedWallet,
    setSelectedWallet,
    handleWalletChange,
    walletDropdownList,
  } = useWalletDropdown({
    walletId: defaultWalletId,
  });

  const {
    selectedAccount,
    setSelectedAccount,
    handleAccountChange,
    accountDropdownList,
  } = useAccountDropdown({
    selectedWallet,
    defaultAccountId,
    includeSubAccounts: false,
  });

  const unitDropdownList: DropDownItemProps[] = useMemo(() => {
    if (!selectedAccount) return [];
    const coinSupport = coinList[selectedAccount.parentAssetId];
    return coinSupport.units.map(unit => ({
      id: unit.abbr,
      text: unit.abbr,
    }));
  }, [selectedAccount]);

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {};
  const tabs: ITabs = [
    {
      name: lang.strings.dialogs.editAccount.accountSelection.title,
      dialogs: [<AccountSelection key="AccountSelection" />],
    },
    {
      name: lang.strings.dialogs.editAccount.accountEdit.title,
      dialogs: [<AccountDetails key="AccountDetails" />],
    },
    {
      name: lang.strings.deleteAccount.title,
      dialogs: [<DeleteAccountDialog key="DeleteAccountDialog" />],
    },
  ];

  const {
    onNext,
    onPrevious,
    goTo,
    currentTab,
    currentDialog,
    isDeviceRequired,
  } = useTabsAndDialogs({
    deviceRequiredDialogsMap,
    tabs,
    dialogName: 'editAccount',
    defaultTab: isSkipAccountSelection ? 1 : 0,
  });

  const [accountName, setAccountName] = useState(selectedAccount?.name ?? '');
  const [selectedUnit, setSelectedUnit] = useState<string | undefined>(
    selectedAccount?.unit,
  );

  const handleAccountNameChange: typeof setAccountName = useCallback(name => {
    if (name.length > 24) return;
    setAccountName(name);
  }, []);

  useEffect(() => {
    handleAccountNameChange(selectedAccount?.name ?? '');
    setSelectedUnit(selectedAccount?.unit);
  }, [selectedAccount]);

  const onClose = () => {
    dispatch(closeDialog('editAccount'));
  };

  const onApply = async () => {
    const id = selectedAccount?.__id;
    if (!id) return;
    const db = getDB();
    updateAccount(db, id, {
      name: accountName.trim(),
      unit: selectedUnit,
    });
    dispatch(
      openSnackBar({
        icon: 'check',
        text: lang.strings.snackbar.accountUpdated,
        buttonText: 'Close',
      }),
    );
    onClose();
  };

  const ctx = useMemo(
    () => ({
      onNext,
      onPrevious,
      tabs,
      onClose,
      goTo,
      currentTab,
      currentDialog,
      isDeviceRequired,
      selectedWallet,
      setSelectedWallet,
      selectedAccount,
      setSelectedAccount,
      handleAccountChange,
      handleWalletChange,
      accountDropdownList,
      walletDropdownList,
      accountName,
      handleAccountNameChange,
      onApply,
      unitDropdownList,
      selectedUnit,
      setSelectedUnit,
    }),
    [
      onNext,
      onPrevious,
      tabs,
      onClose,
      goTo,
      currentTab,
      currentDialog,
      isDeviceRequired,
      selectedWallet,
      setSelectedWallet,
      selectedAccount,
      setSelectedAccount,
      handleAccountChange,
      handleWalletChange,
      accountDropdownList,
      walletDropdownList,
      accountName,
      handleAccountNameChange,
      onApply,
      unitDropdownList,
      selectedUnit,
      setSelectedUnit,
    ],
  );

  return (
    <EditAccountDialogContext.Provider value={ctx}>
      {children}
    </EditAccountDialogContext.Provider>
  );
};

export function useEditAccountDialog(): EditAccountDialogContextInterface {
  return useContext(EditAccountDialogContext);
}
