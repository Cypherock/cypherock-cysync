import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';

import { ITabs } from '~/hooks';
import {
  closeDialog,
  selectLanguage,
  openSnackBar,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import { EditAccount } from '../Dialogs';

export interface EditAccountDialogContextInterface {
  tabs: ITabs;
  onClose: () => void;
  handleApply: () => Promise<void>;
  isLoading: boolean;
  selectedAccount: string;
  selectedWallet: string;
  selectedWalletType: string;
  selectedWalletName: string;
  accountList: Account[];
  walletList: Wallet[];
  walletType: WalletType[];
  handleAccountSelect: (id?: string) => void;
  handleWalletChange: (id?: string) => void;
  handleWalletTypeChange: (id?: string) => void;
  handleWalletNameChange: (id?: string) => void;
  isContinueDisabled: boolean;
  isApplyDisabled: boolean;
}
export interface Account {
  name: string;
  balance: string;
  xpubOrAddress: string;
  unit: string;
  derivationPath: string;
  type: string;
  familyId: string;
  assetId: string;
  parentAssetId: string;
  walletId: string;
  derivationScheme: string;
  isHidden: boolean;
  __version: number;
  __id: string;
  meta: {
    revision: number;
    created: number;
    version: number;
    updated: number;
  };
  $loki: number;
  extraData: {
    unconfirmedBalance: string;
  };
}
export interface Wallet {
  name: string;
  abbr: string;
  balance: number;
  image: string;
  __id: string;
  hasPassphrase: boolean;
  hasPin: boolean;
  deviceId: string;
  __version: number;
  meta: {
    revision: number;
    created: number;
    version: number;
  };
  $loki: number;
}
export interface WalletType {
  name: string;
  __id: string;
}

export const EditAccountDialogContext: Context<EditAccountDialogContextInterface> =
  createContext<EditAccountDialogContextInterface>(
    {} as EditAccountDialogContextInterface,
  );

export interface EditAccountDialogProviderProps {
  children: ReactNode;
}

export const EditAccountDialogProvider: FC<EditAccountDialogProviderProps> = ({
  children,
}) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [selectedWalletType, setSelectedWalletType] = useState('');
  const [selectedWalletName, setSelectedWalletName] = useState('');
  const [isContinueDisabled, setIsContinueDisabled] = useState<boolean>(true);
  const [isApplyDisabled, setIsApplyDisabled] = useState<boolean>(true);
  const accountList = [
    {
      name: 'Bitcoin 1',
      balance: '0',
      xpubOrAddress:
        'zpub6r4DktU16uhotjk1N2fBRLvU1jMkAV3S51hmB1Gx4Qrb3qxVoaEGJXFYLorPrsF5hff6nK2hDd2gTaXedo2iS9ChHUZiYxFrtWbvMrXJQAn',
      unit: 'BTC',
      derivationPath: "m/84'/0'/0'",
      type: 'account',
      familyId: 'bitcoin',
      assetId: 'bitcoin',
      parentAssetId: 'bitcoin',
      walletId:
        '969564e505cc0cedafbcd9bdfd015c89657ee49a3b1cd52f087f26362428bc0b',
      derivationScheme: 'nativeSegwit',
      isHidden: false,
      __version: 0,
      __id: '2521a270-2626-47a6-8bb7-47029d055e76',
      meta: {
        revision: 1,
        created: 1710238689575,
        version: 0,
        updated: 1710238692842,
      },
      $loki: 1,
      extraData: {
        unconfirmedBalance: '0',
      },
    },
  ];

  const walletList = [
    {
      name: 'ISHAAN',
      abbr: 'SOL',
      balance: 0.234,
      image:
        'https://as1.ftcdn.net/v2/jpg/02/22/70/10/1000_F_222701046_Sy6YusoW0rBK3eMUImKMA8Bi53qEZ3pr.jpg',
      __id: '969564e505cc0cedafbcd9bdfd015c89657ee49a3b1cd52f087f26362428bc0b',
      hasPassphrase: false,
      hasPin: true,
      deviceId:
        '020307e80300010041003200135056395532312024e904e3372966dfeac89532',
      __version: 0,
      meta: {
        revision: 0,
        created: 1710238537599,
        version: 0,
      },
      $loki: 1,
    },
  ];

  const walletType = [
    {
      name: 'Solana',
      __id: 'SOL',
    },
    {
      name: 'New',
      __id: 'NE',
    },
  ];

  const validateFirstTab = () => {
    console.log(selectedAccount !== '' && selectedWallet !== '');

    setIsContinueDisabled(selectedAccount !== '' && selectedWallet !== '');
  };

  useEffect(validateFirstTab, [selectedAccount, selectedWallet]);

  const validateSecondTab = () => {
    console.log(selectedWalletName !== '' && selectedWalletType !== '');

    setIsApplyDisabled(selectedWalletName !== '' && selectedWalletType !== '');
  };

  useEffect(validateSecondTab, [selectedWalletName, selectedWalletType]);

  const handleAccountSelect = (id?: string) => {
    if (id) setSelectedAccount(id);
  };

  const handleWalletChange = (id?: string) => {
    if (id) {
      setSelectedWallet(id);
      const tempWallet = walletList.filter(e => e.__id === id)[0];
      setSelectedWalletType(tempWallet.abbr);
      setSelectedWalletName(tempWallet.name);
    }
  };

  const handleWalletTypeChange = (id?: string) => {
    if (id) setSelectedWalletType(id);
  };

  const handleWalletNameChange = (id?: string) => {
    if (id) setSelectedWalletName(id);
    else setSelectedWalletName('');
  };

  const onClose = () => {
    dispatch(closeDialog('editAccount'));
  };

  const handleApply = async () => {
    setIsLoading(true);
    setTimeout(async () => {
      setIsLoading(false);
      await dispatch(closeDialog('editAccount'));
      dispatch(
        openSnackBar({
          icon: 'check',
          text: 'Account name changed',
          buttonText: 'Close',
        }),
      );
    }, 3000);
  };

  const tabs: ITabs = [
    {
      name: lang.strings.dialogs.editAccount.tab1.title,
      dialogs: [<EditAccount key="edit-account-new" />],
    },
  ];

  const ctx = useMemo(
    () => ({
      tabs,
      onClose,
      handleApply,
      isLoading,
      selectedAccount,
      selectedWallet,
      selectedWalletType,
      selectedWalletName,
      accountList,
      walletList,
      walletType,
      handleAccountSelect,
      handleWalletChange,
      handleWalletTypeChange,
      handleWalletNameChange,
      isContinueDisabled,
      isApplyDisabled,
    }),
    [
      tabs,
      onClose,
      handleApply,
      isLoading,
      selectedAccount,
      selectedWallet,
      selectedWalletType,
      selectedWalletName,
      accountList,
      walletList,
      walletType,
      handleAccountSelect,
      handleWalletChange,
      handleWalletTypeChange,
      handleWalletNameChange,
      isContinueDisabled,
      isApplyDisabled,
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
