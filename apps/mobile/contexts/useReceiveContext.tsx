import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAccountList } from '@/hooks/useAccountList';
import { useDeriveAddress } from '@/hooks/useDeriveAddress';
import { IWallet } from '@cypherock/db-interfaces';

interface ReceiveContextType {
  selectedWallet: IWallet | null;
  setSelectedWallet: (wallet: IWallet) => void;
  accountList: any[];
  selectedAccount: any;
  derivedAddress: string;
  handleAccountChange: (accountId: string) => void;
  resetReceiveData: () => void;
  isLoading: boolean;
}

const ReceiveContext = createContext<ReceiveContextType | undefined>(undefined);

export const ReceiveProvider = ({ children }: PropsWithChildren) => {
  const [selectedWallet, setSelectedWallet] = useState<IWallet | null>(null);

  const {
    accountList: allAccounts,
    selectedAccount,
    handleAccountChange,
  } = useAccountList({
    selectedWalletId: selectedWallet?.__id || '',
  });

  const { derivedAddress: computedAddress, isLoading } = useDeriveAddress({
    selectedAccount,
  });

  const [localDerivedAddress, setLocalDerivedAddress] = useState('');

  useEffect(() => {
    if (selectedAccount && computedAddress) {
      setLocalDerivedAddress(computedAddress);
    }
  }, [selectedAccount, computedAddress]);

  const resetReceiveData = () => {
    setLocalDerivedAddress('');
    handleAccountChange();
  };

  return (
    <ReceiveContext.Provider
      value={{
        selectedWallet,
        setSelectedWallet,
        accountList: allAccounts,
        selectedAccount,
        derivedAddress: localDerivedAddress,
        handleAccountChange,
        resetReceiveData,
        isLoading,
      }}
    >
      {children}
    </ReceiveContext.Provider>
  );
};

export const useReceiveContext = () => {
  const context = useContext(ReceiveContext);
  if (!context) {
    throw new Error('useReceiveContext must be used within a ReceiveProvider');
  }
  return context;
};
