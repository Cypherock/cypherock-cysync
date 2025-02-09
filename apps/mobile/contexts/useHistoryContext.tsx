import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
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
  transaction: IDetails | undefined;
  setSelectedTransaction: (transaction: TransactionRowData) => void;
}

const HistoryContext = createContext<HistoryContextProps | undefined>(
  undefined,
);

export const HistoryProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [transaction, setTransaction] = useState<IDetails | undefined>();
  const [selectedTransaction, setSelectedTransaction] = useState<
    TransactionRowData | undefined
  >();

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
      setTransaction(formattedTransaction);
    }
  }, [selectedTransaction]);

  useEffect(() => {
    if (transaction) {
      router.push(`/history/details/${transaction.hash}`);
    }
  }, [transaction]);

  return (
    <HistoryContext.Provider value={{ transaction, setSelectedTransaction }}>
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
