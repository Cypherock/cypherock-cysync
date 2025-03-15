import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
} from 'react';
import { ITransactionInputOutput } from '@cypherock/db-interfaces';
import { TransactionRowData } from '@/hooks/useTransactions';
import { router } from 'expo-router';

interface ISender {
  address: string;
  tag?: boolean;
}

interface IDetails {
  value: string;
  hash: string;
  fee: string;
  date: string;
  type: string;
  status: string;
  wallet: string;
  account: string;
  asset: string;
  sender: ISender[];
  receiver: ISender[];
}

interface HistoryContextProps {
  transaction: TransactionRowData | undefined;
  details: IDetails | undefined;
  setSelectedTransaction: (transaction: TransactionRowData | undefined) => void;
  setFrom: Dispatch<SetStateAction<'/history' | '/notification'>>;
}

const HistoryContext = createContext<HistoryContextProps | undefined>(
  undefined,
);

export const HistoryProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [details, setDetails] = useState<IDetails | undefined>();
  const [selectedTransaction, setSelectedTransaction] = useState<
    TransactionRowData | undefined
  >();
  const [from, setFrom] = useState<'/history' | '/notification'>('/history');

  useEffect(() => {
    if (selectedTransaction) {
      const formattedTransaction: IDetails = {
        hash: selectedTransaction.hash,
        value: selectedTransaction.displayAmount,
        fee: selectedTransaction.displayFee,
        date: selectedTransaction.dateHeader,
        type: selectedTransaction.typeText,
        status: selectedTransaction.statusText,
        wallet: selectedTransaction.walletName,
        account: selectedTransaction.accountName,
        asset: selectedTransaction.assetName,
        sender: selectedTransaction.txn.inputs.map(
          (s: ITransactionInputOutput) => ({
            address: s.address,
            tag: s.isMine,
          }),
        ),
        receiver: selectedTransaction.txn.outputs.map(
          (r: ITransactionInputOutput) => ({
            address: r.address,
            tag: r.isMine,
          }),
        ),
      };
      setDetails(formattedTransaction);
    }
  }, [selectedTransaction]);

  useEffect(() => {
    if (details) {
      router.push({
        pathname: '/details',
        params: { id: details.hash, from: from },
      });
    }
  }, [details, from]);

  return (
    <HistoryContext.Provider
      value={{
        transaction: selectedTransaction,
        details,
        setSelectedTransaction,
        setFrom,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistoryContext = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistoryContext must be used within a HistoryProvider');
  }
  return context;
};
