import { BigNumber } from '@cypherock/cysync-utils';
import {
  ITransaction,
  IAccount,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';

import { ISolanaTransactionItem } from '../api';

export const parseTransactionItem = (params: {
  transactionItem: ISolanaTransactionItem;
  account: IAccount;
}): ITransaction[] => {
  const { account, transactionItem } = params;
  const result: ITransaction[] = [];

  const myAddress = account.xpubOrAddress;
  const fees = new BigNumber(transactionItem.meta?.fee ?? 0);
  // We show the fees only for the first parsable instruction to prevent double counting
  let isFeesAlreadyIncluded = false;

  // Only iterate through parsable instructions
  for (const instruction of (
    transactionItem.transaction?.message?.instructions ?? []
  ).filter(ins => ins.parsed !== undefined)) {
    const fromAddr = instruction.parsed?.info?.source;
    const toAddr = instruction.parsed?.info?.destination;

    if (fromAddr !== myAddress && toAddr !== myAddress) continue;

    const selfTransfer = fromAddr === toAddr;
    const amount = String(instruction.parsed?.info?.lamports || 0);

    const txn: ITransaction = {
      hash: transactionItem.signature,
      accountId: account.__id ?? '',
      walletId: account.walletId,
      assetId: account.parentAssetId,
      parentAssetId: account.parentAssetId,
      familyId: account.familyId,
      amount: selfTransfer ? '0' : amount,
      fees: isFeesAlreadyIncluded ? '0' : fees.toString(),
      confirmations: 1,
      status:
        transactionItem.meta?.err || transactionItem.err
          ? TransactionStatusMap.failed
          : TransactionStatusMap.success,
      type:
        myAddress === fromAddr
          ? TransactionTypeMap.send
          : TransactionTypeMap.receive,
      timestamp: new Date(
        parseInt(transactionItem.blockTime.toString(), 10) * 1000,
      ).getTime(),
      blockHeight: transactionItem.slot,
      inputs: [
        {
          address: fromAddr,
          amount,
          isMine: myAddress === fromAddr,
        },
      ],
      outputs: [
        {
          address: toAddr,
          amount,
          isMine: myAddress === toAddr,
        },
      ],
      extraData: {
        instructionType: instruction.parsed?.type,
      },
    };

    result.push(txn);
    isFeesAlreadyIncluded = true;
  }
  return result;
};
