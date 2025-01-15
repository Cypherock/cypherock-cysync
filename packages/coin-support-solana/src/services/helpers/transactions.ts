import { solanaCoinList } from '@cypherock/coins';
import {
  IAccount,
  IDatabase,
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';
import { getLatestBlockHash } from '@cypherock/sdk-app-solana';

import {
  InstructionType,
  parseTokenTransactionItem,
  parseTransactionItem,
  TransactionParserReturnType,
} from './common';

import { getCoinSupportWeb3Lib, getTokenSupportSplTokenLib } from '../../utils';
import { ISolanaTransactionItem } from '../api';

export interface ICustomSolanaInstruction {
  type: InstructionType;
  amount?: number;
  recipient: string;
  mintAddress?: string;
}

export const mapTransactionsForDb = async (params: {
  db: IDatabase;
  account: IAccount;
  rawTransactions: ISolanaTransactionItem[];
}): Promise<TransactionParserReturnType> => {
  const { db, account, rawTransactions } = params;
  const result: TransactionParserReturnType = {
    transactions: [],
    newAccounts: [],
  };

  for (const rawTxn of rawTransactions) {
    const { transactions, newAccounts } = await parseTransactionItem({
      db,
      account,
      transactionItem: rawTxn,
    });

    result.transactions.push(...transactions);
    result.newAccounts.push(...newAccounts);

    // Even if the transaction failed, the transaction fee is still deducted.
    for (const transaction of transactions) {
      if (
        transaction.status === TransactionStatusMap.failed &&
        transaction.type === TransactionTypeMap.send
      ) {
        result.transactions.push({
          ...transaction,
          status: TransactionStatusMap.success,
          type: TransactionTypeMap.hidden,
          amount: '0',
        });
      }
    }
  }

  return result;
};

export const mapTokenTransactionsForDb = (
  account: IAccount,
  rawTransactions: ISolanaTransactionItem[],
): ITransaction[] => {
  const transactions: ITransaction[] = [];

  for (const rawTxn of rawTransactions) {
    const txns = parseTokenTransactionItem(rawTxn, account);
    transactions.push(...txns);
  }

  return transactions;
};

export const constructTransaction = async (
  assetId: string,
  payer: string,
  instructions: ICustomSolanaInstruction[],
) => {
  const recentBlockhash = await getLatestBlockHash(
    solanaCoinList[assetId].network,
  );

  const web3Lib = getCoinSupportWeb3Lib();
  const splTokenLibrary = getTokenSupportSplTokenLib();

  const feePayer = new web3Lib.PublicKey(payer);

  const txn = new web3Lib.Transaction({
    recentBlockhash,
    feePayer,
  });

  for (const instruction of instructions) {
    let constructedInstruction: any;

    if (instruction.type === InstructionType.transfer) {
      constructedInstruction = web3Lib.SystemProgram.transfer({
        fromPubkey: feePayer,
        toPubkey: new web3Lib.PublicKey(instruction.recipient),
        lamports: instruction.amount ?? 0,
      });
    } else {
      if (!instruction.mintAddress) continue;

      const mintPubKey = new web3Lib.PublicKey(instruction.mintAddress);
      const recipientPubKey = new web3Lib.PublicKey(instruction.recipient);
      const recipientTokenAccount =
        splTokenLibrary.getAssociatedTokenAddressSync(
          mintPubKey,
          recipientPubKey,
        );

      if (instruction.type === InstructionType.create) {
        constructedInstruction =
          splTokenLibrary.createAssociatedTokenAccountInstruction(
            feePayer,
            recipientTokenAccount,
            recipientPubKey,
            mintPubKey,
          );
      } else if (instruction.type === InstructionType.transferChecked) {
        constructedInstruction = splTokenLibrary.createTransferInstruction(
          feePayer,
          recipientTokenAccount,
          recipientPubKey,
          instruction.amount ?? 0,
        );
      }
    }

    if (constructedInstruction) txn.add(constructedInstruction);
  }

  return txn;
};
