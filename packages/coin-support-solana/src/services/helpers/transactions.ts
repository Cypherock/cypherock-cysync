import { solanaCoinList } from '@cypherock/coins';
import {
  IAccount,
  IDatabase,
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';
import { getLatestBlockHash } from '@cypherock/sdk-app-solana';

import { parseTokenTransactionItem, parseTransactionItem } from './common';

import { getCoinSupportWeb3Lib, getTokenSupportSplTokenLib } from '../../utils';

import { ISolanaTransactionItem } from '../api';
import {
  ICustomSolanaInstruction,
  InstructionType,
  TransactionParserReturnType,
} from './types';

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

export const mapTokenTransactionsForDb = async (
  account: IAccount,
  rawTransactions: ISolanaTransactionItem[],
): Promise<ITransaction[]> => {
  const transactions: ITransaction[] = [];

  for (const rawTxn of rawTransactions) {
    const txns = await parseTokenTransactionItem(rawTxn, account);
    transactions.push(...txns);
  }

  return transactions;
};

export const constructTransaction = async (
  assetId: string,
  payer: string,
  instructions: ICustomSolanaInstruction[],
  computeUnits = 200_000,
  computeUnitPrice = 0,
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

  txn.add(
    web3Lib.ComputeBudgetProgram.setComputeUnitLimit({ units: computeUnits }),
  );
  txn.add(
    web3Lib.ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: computeUnitPrice,
    }),
  );

  for (const instruction of instructions) {
    let constructedInstruction: any;

    if (instruction.type === InstructionType.transfer) {
      constructedInstruction = web3Lib.SystemProgram.transfer({
        fromPubkey: feePayer,
        toPubkey: new web3Lib.PublicKey(instruction.recipient),
        lamports: instruction.amount,
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

      if (instruction.type === InstructionType.createAccount) {
        constructedInstruction =
          splTokenLibrary.createAssociatedTokenAccountInstruction(
            feePayer,
            recipientTokenAccount,
            recipientPubKey,
            mintPubKey,
          );
      } else if (instruction.type === InstructionType.transferChecked) {
        const senderTokenAccount =
          splTokenLibrary.getAssociatedTokenAddressSync(mintPubKey, feePayer);

        constructedInstruction =
          splTokenLibrary.createTransferCheckedInstruction(
            senderTokenAccount,
            mintPubKey,
            recipientTokenAccount,
            feePayer,
            instruction.amount,
            instruction.decimals,
          );
      }
    }

    if (constructedInstruction) txn.add(constructedInstruction);
  }

  return txn;
};
