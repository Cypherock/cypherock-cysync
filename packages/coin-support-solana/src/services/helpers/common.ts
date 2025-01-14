import { BigNumber } from '@cypherock/cysync-utils';
import {
  ITransaction,
  IAccount,
  TransactionStatusMap,
  TransactionTypeMap,
  AccountTypeMap,
  IDatabase,
} from '@cypherock/db-interfaces';
import { coinList, ISolanaCoinInfo } from '@cypherock/coins';
import { insertAccountIfNotExists } from '@cypherock/coin-support-utils';

import { deriveAssociatedTokenAddress } from '../../utils';
import { ISolanaSplTokenAccount } from '../../operations/types';

import { ISolanaInstruction, ISolanaTransactionItem } from '../api';

enum InstructionType {
  create = 'create',
  transfer = 'transfer',
  transferChecked = 'transferChecked',
}

export interface TransactionParserReturnType {
  transactions: ITransaction[];
  newAccounts: IAccount[];
}

const parseCoinTransaction = (
  instruction: ISolanaInstruction,
  account: IAccount,
  transactionItem: ISolanaTransactionItem,
  fees: string,
): ITransaction | undefined => {
  const myAddress = account.xpubOrAddress;
  const fromAddr = instruction.parsed?.info?.source;
  const toAddr = instruction.parsed?.info?.destination;

  if (fromAddr !== myAddress && toAddr !== myAddress) return undefined;

  const selfTransfer = fromAddr === toAddr;
  const amount = String(instruction.parsed?.info?.lamports || 0);

  const isSend = fromAddr === myAddress;

  const customId = `id-${isSend ? toAddr : fromAddr}-${amount}`;

  const txn: ITransaction = {
    hash: transactionItem.signature,
    accountId: account.__id ?? '',
    walletId: account.walletId,
    assetId: account.parentAssetId,
    parentAssetId: account.parentAssetId,
    familyId: account.familyId,
    amount: selfTransfer ? '0' : amount,
    fees,
    confirmations: 1,
    status:
      transactionItem.meta?.err || transactionItem.err
        ? TransactionStatusMap.failed
        : TransactionStatusMap.success,
    type: isSend ? TransactionTypeMap.send : TransactionTypeMap.receive,
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
    subType: InstructionType.transfer,
    customId,
    extraData: {
      instructionType: instruction.parsed?.type,
    },
  };

  return txn;
};

const determineAndSaveNewTokenAccounts = async (
  instruction: ISolanaInstruction,
  account: IAccount,
  db: IDatabase,
): Promise<IAccount[]> => {
  const newAccounts: IAccount[] = [];

  const mint = instruction.parsed.info?.mint;

  const coin = coinList[account.assetId] as ISolanaCoinInfo;
  const tokenObj = Object.values(coin.tokens).find(e => mint === e.address);

  if (tokenObj) {
    let tokenAccount: ISolanaSplTokenAccount = {
      walletId: account.walletId,
      assetId: tokenObj.id,
      familyId: account.familyId,
      parentAccountId: account.__id ?? '',
      parentAssetId: account.parentAssetId,
      type: AccountTypeMap.subAccount,
      name: tokenObj.name,
      derivationPath: account.derivationPath,
      unit: undefined,
      xpubOrAddress: account.xpubOrAddress,
      balance: '0',
      extraData: {
        contractAddress: tokenObj.address,
      },
      isHidden: false,
    };

    const insertedResult = await insertAccountIfNotExists(db, tokenAccount);
    tokenAccount = insertedResult.account as ISolanaSplTokenAccount;

    if (insertedResult.isInserted) {
      newAccounts.push(tokenAccount);
    }
  }

  return newAccounts;
};

const isSendTokenInstruction = (
  instruction: ISolanaInstruction,
  accountAddress: string,
) => {
  const { source, mint } = instruction.parsed.info ?? {};
  const myTokenAddress = deriveAssociatedTokenAddress(accountAddress, mint);

  return source === myTokenAddress;
};

const parseCreateTokenTransaction = (
  instruction: ISolanaInstruction,
  account: IAccount,
  transactionItem: ISolanaTransactionItem,
): ITransaction | undefined => {
  const myAddress = account.xpubOrAddress;
  const {
    newAccount: destination,
    source,
    lamports,
  } = instruction.parsed?.info ?? {};

  if (source !== myAddress) return undefined;

  const amount = String(lamports ?? 0);

  const txn: ITransaction = {
    hash: transactionItem.signature,
    accountId: account.__id ?? '',
    walletId: account.walletId,
    assetId: account.assetId,
    parentAssetId: account.parentAssetId,
    familyId: account.familyId,
    amount,
    fees: '0',
    confirmations: 1,
    status: TransactionStatusMap.success,
    type: TransactionTypeMap.send,
    timestamp: new Date(
      parseInt(transactionItem.blockTime.toString(), 10) * 1000,
    ).getTime(),
    blockHeight: transactionItem.slot,
    inputs: [
      {
        address: myAddress,
        amount,
        isMine: true,
      },
    ],
    outputs: [
      {
        address: destination,
        amount,
        isMine: false,
      },
    ],
    subType: InstructionType.create,
    customId: `id-${destination}`,
    extraData: {
      InstructionType: InstructionType.create,
    },
  };

  return txn;
};

const parseTokenTransferTransaction = (
  instruction: ISolanaInstruction,
  account: IAccount,
  transactionItem: ISolanaTransactionItem,
  fees: string,
): ITransaction | undefined => {
  const { source, destination, mint, tokenAmount } =
    instruction.parsed.info ?? {};

  const myAddress = account.xpubOrAddress;
  const myTokenAddress = deriveAssociatedTokenAddress(myAddress, mint);

  if (source !== myTokenAddress && destination !== myTokenAddress) {
    return undefined;
  }

  const selfTransfer = source === destination;
  const amount = String(tokenAmount?.amount ?? 0);

  const isSend = source === myTokenAddress;

  const fromAddr = isSend ? myAddress : source;
  const toAddr = isSend ? destination : myAddress;

  const customId = `id-${isSend ? destination : source}-${amount}`;

  const txn: ITransaction = {
    hash: transactionItem.signature,
    accountId: account.__id ?? '',
    parentAccountId: account.parentAccountId ?? '',
    walletId: account.walletId,
    assetId: account.assetId,
    parentAssetId: account.parentAssetId,
    familyId: account.familyId,
    amount: selfTransfer ? '0' : amount,
    fees,
    confirmations: 1,
    status:
      transactionItem.meta?.err || transactionItem.err
        ? TransactionStatusMap.failed
        : TransactionStatusMap.success,
    type: isSend ? TransactionTypeMap.send : TransactionTypeMap.receive,
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
    subType: InstructionType.transferChecked,
    customId,
    extraData: {
      instructionType: instruction.parsed.type,
    },
  };

  return txn;
};

export const parseTransactionItem = async (params: {
  transactionItem: ISolanaTransactionItem;
  account: IAccount;
  db: IDatabase;
}): Promise<TransactionParserReturnType> => {
  const { account, transactionItem, db } = params;
  const result: TransactionParserReturnType = {
    transactions: [],
    newAccounts: [],
  };

  const fees = new BigNumber(transactionItem.meta?.fee ?? 0);
  // We show the fees only for the first parsable instruction to prevent double counting
  let isFeesAlreadyIncluded = false;

  let isSendTokenTxnFound = false;

  // Only iterate through parsable instructions
  for (const instruction of (
    transactionItem.transaction?.message?.instructions ?? []
  ).filter(ins => ins.parsed !== undefined)) {
    // get the type of instruction: transfer SOL(transfer) | transfer token(transferChecked) | create token account(create)
    if (instruction.parsed.type === InstructionType.transfer) {
      // SOL transfer
      const txn = parseCoinTransaction(
        instruction,
        account,
        transactionItem,
        isFeesAlreadyIncluded ? '0' : fees.toString(),
      );

      if (txn) {
        result.transactions.push(txn);
        isFeesAlreadyIncluded = true;
      }
    } else if (instruction.parsed.type === InstructionType.transferChecked) {
      // spl token transfer
      // In case of token transactions, only save new tokens and fee transactions: token transactions will be synced on token account separately
      const newAccounts = await determineAndSaveNewTokenAccounts(
        instruction,
        account,
        db,
      );
      result.newAccounts.push(...newAccounts);

      isSendTokenTxnFound = isSendTokenInstruction(
        instruction,
        account.xpubOrAddress,
      );
    }
  }

  // Parse the createAccount transactions from inner instructions
  for (const innerInstruction of transactionItem.meta?.innerInstructions?.[0]
    ?.instructions ?? []) {
    if (innerInstruction.parsed?.type === 'createAccount') {
      const txn = parseCreateTokenTransaction(
        innerInstruction,
        account,
        transactionItem,
      );
      if (txn) result.transactions.push(txn);
    }
  }

  // Include a fees txn if not already included and any send token txn found
  // In case of send coin txn it will be already included above
  if (!isFeesAlreadyIncluded && isSendTokenTxnFound && !fees.isZero()) {
    result.transactions.push({
      hash: transactionItem.signature,
      accountId: account.__id ?? '',
      walletId: account.walletId,
      assetId: account.assetId,
      parentAssetId: account.parentAssetId,
      familyId: account.familyId,
      amount: '0',
      fees: fees.toString(),
      confirmations: 1,
      status: TransactionStatusMap.success,
      type: TransactionTypeMap.hidden,
      timestamp: new Date(
        parseInt(transactionItem.blockTime.toString(), 10) * 1000,
      ).getTime(),
      blockHeight: transactionItem.slot,
      inputs: [],
      outputs: [],
      subType: 'feeDeduction',
    });
  }

  return result;
};

export const parseTokenTransactionItem = (
  transactionItem: ISolanaTransactionItem,
  account: IAccount,
): ITransaction[] => {
  const transactions: ITransaction[] = [];

  const fees = new BigNumber(transactionItem.meta?.fee ?? 0).toString();

  // Only iterate through parsable token instructions
  for (const instruction of (
    transactionItem.transaction?.message?.instructions ?? []
  ).filter(ins => ins.parsed !== undefined)) {
    // get the type of instruction: transfer SOL(transfer) | transfer token(transferChecked) | create token account(create)
    if (instruction.parsed.type === InstructionType.transferChecked) {
      const txn = parseTokenTransferTransaction(
        instruction,
        account,
        transactionItem,
        fees,
      );

      if (txn) transactions.push(txn);
    }
  }

  return transactions;
};
