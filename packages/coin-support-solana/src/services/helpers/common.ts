import { insertAccountIfNotExists } from '@cypherock/coin-support-utils';
import { coinList, ISolanaCoinInfo } from '@cypherock/coins';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  ITransaction,
  IAccount,
  TransactionStatusMap,
  TransactionTypeMap,
  AccountTypeMap,
  IDatabase,
} from '@cypherock/db-interfaces';

import { InstructionType, TransactionParserReturnType } from './types';

import { ISolanaSplTokenAccount } from '../../operations/types';
import {
  deriveAssociatedTokenAddress,
  getCoinSupportWeb3Lib,
  getTokenSupportSplTokenLib,
} from '../../utils';
import {
  getAccountInfo,
  ISolanaInstruction,
  ISolanaTransactionItem,
} from '../api';

const parseCoinTransaction = (
  instruction: ISolanaInstruction,
  account: IAccount,
  transactionItem: ISolanaTransactionItem,
  fees: string,
  instructionIndex: number,
): ITransaction | undefined => {
  const myAddress = account.xpubOrAddress;
  const fromAddr = instruction.parsed?.info?.source;
  const toAddr = instruction.parsed?.info?.destination;

  if (fromAddr !== myAddress && toAddr !== myAddress) return undefined;

  const selfTransfer = fromAddr === toAddr;
  const amount = String(instruction.parsed?.info?.lamports || 0);

  const isSend = fromAddr === myAddress;

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
    customId: `id-${instructionIndex}`,
    extraData: {
      instructionType: instruction.parsed?.type,
    },
  };

  return txn;
};

const determineAndSaveNewTokenAccounts = async (
  mint: string,
  account: IAccount,
  db: IDatabase,
): Promise<IAccount[]> => {
  const newAccounts: IAccount[] = [];

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
  source: string,
  mint: string,
  accountAddress: string,
) => {
  const myTokenAddress = deriveAssociatedTokenAddress(accountAddress, mint);

  return source === myTokenAddress;
};

const parseCreateTokenTransaction = (
  instruction: ISolanaInstruction,
  account: IAccount,
  transactionItem: ISolanaTransactionItem,
  instructionIndex: number,
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
    subType: InstructionType.createAccount,
    customId: `id-${instructionIndex}`,
    extraData: {
      InstructionType: InstructionType.createAccount,
    },
  };

  return txn;
};

const parseTokenTransferTransaction = async (
  instruction: ISolanaInstruction,
  account: IAccount,
  transactionItem: ISolanaTransactionItem,
  fees: string,
  instructionIndex: number,
): Promise<ITransaction | undefined> => {
  const { source, destination, tokenAmount } = instruction.parsed.info ?? {};

  let amount = '0';
  if (tokenAmount) amount = String(tokenAmount.amount ?? 0);
  else amount = String(instruction.parsed.info.amount ?? 0);

  let mint = instruction.parsed.info?.mint; // in case of transferChecked
  if (!mint && source) {
    // no mint present in case of transfer
    const accountInfo = await getAccountInfo(source, account.parentAssetId);
    mint = accountInfo?.value?.data?.parsed?.info?.mint;
  }

  const myAddress = account.xpubOrAddress;
  const myTokenAddress = deriveAssociatedTokenAddress(myAddress, mint);

  if (source !== myTokenAddress && destination !== myTokenAddress) {
    return undefined;
  }

  const selfTransfer = source === destination;

  const isSend = source === myTokenAddress;

  let fromAddr = source;
  let toAddr = destination;

  const accountInfo = await getAccountInfo(
    isSend ? destination : source,
    account.parentAssetId,
  );
  if (isSend) {
    fromAddr = myAddress;
    toAddr = accountInfo?.value?.data?.parsed?.info?.owner ?? toAddr;
  } else {
    fromAddr = accountInfo?.value?.data?.parsed?.info?.owner ?? fromAddr;
    toAddr = myAddress;
  }

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
    customId: `id-${instructionIndex}`,
    extraData: {
      instructionType: InstructionType.transferChecked,
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

  const coinSupportWeb3Lib = getCoinSupportWeb3Lib();
  const splTokenLib = getTokenSupportSplTokenLib();

  const result: TransactionParserReturnType = {
    transactions: [],
    newAccounts: [],
  };

  const fees = new BigNumber(transactionItem.meta?.fee ?? 0);
  // We show the fees only for the first parsable instruction to prevent double counting
  let isFeesAlreadyIncluded = false;

  let isSendTokenTxnFound = false;
  let solTransferInstructionIndex = 0;

  // Only iterate through parsable instructions
  for (const instruction of (
    transactionItem.transaction?.message?.instructions ?? []
  ).filter(ins => ins.parsed !== undefined)) {
    // get the type of instruction: SOL transfer | token transfer
    if (
      instruction.programId ===
        coinSupportWeb3Lib.PublicKey.default.toString() &&
      instruction.parsed.type === InstructionType.transfer
    ) {
      // SOL transfer
      const txn = parseCoinTransaction(
        instruction,
        account,
        transactionItem,
        isFeesAlreadyIncluded ? '0' : fees.toString(),
        solTransferInstructionIndex,
      );

      if (txn) {
        result.transactions.push(txn);
        isFeesAlreadyIncluded = true;
        solTransferInstructionIndex += 1;
      }
    } else if (
      instruction.programId === splTokenLib.TOKEN_PROGRAM_ID.toString() &&
      (instruction.parsed.type === InstructionType.transfer ||
        instruction.parsed.type === InstructionType.transferChecked)
    ) {
      // spl token transfer
      // In case of token transactions, only save new tokens and fee transactions: token transactions will be synced on token account separately
      let mint = instruction.parsed.info?.mint;
      const { source } = instruction.parsed.info;
      if (!mint && source) {
        const accountInfo = await getAccountInfo(source, account.parentAssetId);
        mint = accountInfo?.value?.data?.parsed?.info?.mint;
      }

      const newAccounts = await determineAndSaveNewTokenAccounts(
        mint,
        account,
        db,
      );
      result.newAccounts.push(...newAccounts);

      isSendTokenTxnFound = isSendTokenInstruction(
        source,
        mint,
        account.xpubOrAddress,
      );
    }
  }

  let createAccountInstructionIndex = 0;
  // Parse the createAccount transactions from inner instructions
  for (const innerInstruction of transactionItem.meta?.innerInstructions?.[0]
    ?.instructions ?? []) {
    if (
      innerInstruction.programId ===
        coinSupportWeb3Lib.PublicKey.default.toString() &&
      innerInstruction.parsed?.type === InstructionType.createAccount
    ) {
      const txn = parseCreateTokenTransaction(
        innerInstruction,
        account,
        transactionItem,
        createAccountInstructionIndex,
      );
      if (txn) {
        result.transactions.push(txn);
        createAccountInstructionIndex += 1;
      }
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

export const parseTokenTransactionItem = async (
  transactionItem: ISolanaTransactionItem,
  account: IAccount,
): Promise<ITransaction[]> => {
  const splTokenLib = getTokenSupportSplTokenLib();

  const transactions: ITransaction[] = [];

  const fees = new BigNumber(transactionItem.meta?.fee ?? 0).toString();

  let tokenTransferInstructionIndex = 0;

  // Only iterate through parsable token instructions
  for (const instruction of (
    transactionItem.transaction?.message?.instructions ?? []
  ).filter(ins => ins.parsed !== undefined)) {
    // get the transfer token instruction
    if (
      instruction.programId === splTokenLib.TOKEN_PROGRAM_ID.toString() &&
      (instruction.parsed.type === InstructionType.transfer ||
        instruction.parsed.type === InstructionType.transferChecked)
    ) {
      const txn = await parseTokenTransferTransaction(
        instruction,
        account,
        transactionItem,
        fees,
        tokenTransferInstructionIndex,
      );

      if (txn) {
        transactions.push(txn);
        tokenTransferInstructionIndex += 1;
      }
    }
  }

  return transactions;
};
