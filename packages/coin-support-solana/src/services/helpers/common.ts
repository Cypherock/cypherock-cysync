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

const parseStakeFundingTransaction = (
  instruction: ISolanaInstruction,
  account: IAccount,
  transactionItem: ISolanaTransactionItem,
  fees: string,
  instructionIndex: number,
): ITransaction | undefined => {
  const myAddress = account.xpubOrAddress;
  const { source, newAccount, lamports } = instruction.parsed?.info ?? {};

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
    fees,
    confirmations: 1,
    status:
      transactionItem.meta?.err || transactionItem.err
        ? TransactionStatusMap.failed
        : TransactionStatusMap.success,
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
        address: newAccount,
        amount,
        isMine: false,
      },
    ],
    subType: InstructionType.createAccountWithSeed,
    customId: `id-${instructionIndex}`,
    extraData: {
      instructionType: instruction.parsed?.type,
    },
  };

  return txn;
};

const parseStakeWithdrawTransactions = (
  instructions: ISolanaInstruction[],
  account: IAccount,
  transactionItem: ISolanaTransactionItem,
  fees: string,
): ITransaction | undefined => {
  const myAddress = account.xpubOrAddress;

  const matching = instructions.filter(
    instruction => instruction.parsed?.info?.destination === myAddress,
  );

  if (matching.length === 0) return undefined;

  let totalLamports = new BigNumber(0);
  const inputs = matching.map(instruction => {
    const { stakeAccount, lamports } = instruction.parsed?.info ?? {};
    const lamportsStr = String(lamports ?? 0);
    totalLamports = totalLamports.plus(lamportsStr);

    return {
      address: stakeAccount,
      amount: lamportsStr,
      isMine: false,
    };
  });

  const amount = totalLamports.toString();

  const txn: ITransaction = {
    hash: transactionItem.signature,
    accountId: account.__id ?? '',
    walletId: account.walletId,
    assetId: account.assetId,
    parentAssetId: account.parentAssetId,
    familyId: account.familyId,
    amount,
    fees,
    confirmations: 1,
    status:
      transactionItem.meta?.err || transactionItem.err
        ? TransactionStatusMap.failed
        : TransactionStatusMap.success,
    type: TransactionTypeMap.receive,
    timestamp: new Date(
      parseInt(transactionItem.blockTime.toString(), 10) * 1000,
    ).getTime(),
    blockHeight: transactionItem.slot,
    inputs,
    outputs: [
      {
        address: myAddress,
        amount,
        isMine: true,
      },
    ],
    subType: InstructionType.stakeWithdraw,
    customId: 'id-0',
    extraData: {
      instructionType: InstructionType.stakeWithdraw,
      stakeAccountCount: matching.length,
    },
  };

  return txn;
};

const parseStakeEventTransaction = (
  instruction: ISolanaInstruction,
  account: IAccount,
  transactionItem: ISolanaTransactionItem,
  instructionIndex: number,
): ITransaction => {
  const txn: ITransaction = {
    hash: transactionItem.signature,
    accountId: account.__id ?? '',
    walletId: account.walletId,
    assetId: account.assetId,
    parentAssetId: account.parentAssetId,
    familyId: account.familyId,
    amount: '0',
    fees: '0',
    confirmations: 1,
    status:
      transactionItem.meta?.err || transactionItem.err
        ? TransactionStatusMap.failed
        : TransactionStatusMap.success,
    type: TransactionTypeMap.hidden,
    timestamp: new Date(
      parseInt(transactionItem.blockTime.toString(), 10) * 1000,
    ).getTime(),
    blockHeight: transactionItem.slot,
    inputs: [],
    outputs: [],
    subType: instruction.parsed?.type,
    customId: `id-${instructionIndex}`,
    extraData: {
      instructionType: instruction.parsed?.type,
    },
  };

  return txn;
};

const parseStakeDeactivateTransactions = (
  instructions: ISolanaInstruction[],
  account: IAccount,
  transactionItem: ISolanaTransactionItem,
  fees: string,
): ITransaction | undefined => {
  if (instructions.length === 0) return undefined;

  const stakeAccounts = instructions
    .map(instruction => instruction.parsed?.info?.stakeAccount)
    .filter(Boolean);

  const txn: ITransaction = {
    hash: transactionItem.signature,
    accountId: account.__id ?? '',
    walletId: account.walletId,
    assetId: account.assetId,
    parentAssetId: account.parentAssetId,
    familyId: account.familyId,
    amount: '0',
    fees,
    confirmations: 1,
    status:
      transactionItem.meta?.err || transactionItem.err
        ? TransactionStatusMap.failed
        : TransactionStatusMap.success,
    type: TransactionTypeMap.send,
    timestamp: new Date(
      parseInt(transactionItem.blockTime.toString(), 10) * 1000,
    ).getTime(),
    blockHeight: transactionItem.slot,
    inputs: [],
    outputs: stakeAccounts.map(address => ({
      address,
      amount: '0',
      isMine: false,
    })),
    subType: InstructionType.stakeDeactivate,
    customId: 'id-0',
    extraData: {
      instructionType: InstructionType.stakeDeactivate,
      stakeAccountCount: instructions.length,
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

const getTransactionStatus = (transactionItem: ISolanaTransactionItem) =>
  transactionItem.meta?.err || transactionItem.err
    ? TransactionStatusMap.failed
    : TransactionStatusMap.success;

const getTokenTransferAmount = (instruction: ISolanaInstruction): string => {
  const { tokenAmount } = instruction.parsed.info ?? {};

  if (tokenAmount) return String(tokenAmount.amount ?? 0);
  return String(instruction.parsed.info.amount ?? 0);
};

const getTokenTransferMint = async (
  instruction: ISolanaInstruction,
  account: IAccount,
): Promise<string> => {
  const { source } = instruction.parsed.info ?? {};

  let mint = instruction.parsed.info?.mint; // in case of transferChecked
  if (!mint && source) {
    // no mint present in case of transfer
    const accountInfo = await getAccountInfo(source, account.parentAssetId);
    mint = accountInfo?.value?.data?.parsed?.info?.mint;
  }

  return mint;
};

const getTokenTransferAddresses = async (
  isSend: boolean,
  source: string,
  destination: string,
  account: IAccount,
): Promise<{ fromAddr: string; toAddr: string }> => {
  const myAddress = account.xpubOrAddress;
  const accountInfo = await getAccountInfo(
    isSend ? destination : source,
    account.parentAssetId,
  );
  const owner = accountInfo?.value?.data?.parsed?.info?.owner;

  if (isSend) return { fromAddr: myAddress, toAddr: owner ?? destination };
  return { fromAddr: owner ?? source, toAddr: myAddress };
};

const parseTokenTransferTransaction = async (
  instruction: ISolanaInstruction,
  account: IAccount,
  transactionItem: ISolanaTransactionItem,
  fees: string,
  instructionIndex: number,
): Promise<ITransaction | undefined> => {
  const { source, destination } = instruction.parsed.info ?? {};

  const amount = getTokenTransferAmount(instruction);
  const mint = await getTokenTransferMint(instruction, account);

  const myAddress = account.xpubOrAddress;
  const myTokenAddress = deriveAssociatedTokenAddress(myAddress, mint);

  if (source !== myTokenAddress && destination !== myTokenAddress) {
    return undefined;
  }

  const selfTransfer = source === destination;

  const isSend = source === myTokenAddress;

  const { fromAddr, toAddr } = await getTokenTransferAddresses(
    isSend,
    source,
    destination,
    account,
  );

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
    status: getTransactionStatus(transactionItem),
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

interface IParseTransactionContext {
  account: IAccount;
  transactionItem: ISolanaTransactionItem;
  db: IDatabase;
  fees: BigNumber;
  systemProgramId: string;
  stakeProgramId: string;
  tokenProgramId: string;
}

class ParseTransactionState {
  // We show the fees only for the first parsable instruction to prevent double counting
  isFeesAlreadyIncluded = false;

  isSendTokenTxnFound = false;

  hasVisibleTransferRow = false;

  solTransferInstructionIndex = 0;

  stakeFundingInstructionIndex = 0;

  stakeEventInstructionIndex = 0;

  stakeWithdrawInstructions: ISolanaInstruction[] = [];

  stakeDeactivateInstructions: ISolanaInstruction[] = [];

  markFeesIncluded() {
    this.isFeesAlreadyIncluded = true;
  }

  recordSolTransferRow() {
    this.isFeesAlreadyIncluded = true;
    this.hasVisibleTransferRow = true;
    this.solTransferInstructionIndex += 1;
  }

  recordStakeFundingRow() {
    this.isFeesAlreadyIncluded = true;
    this.stakeFundingInstructionIndex += 1;
  }

  recordStakeEvent() {
    this.stakeEventInstructionIndex += 1;
  }

  setSendTokenTxnFound(value: boolean) {
    this.isSendTokenTxnFound = value;
  }
}

type InstructionKind =
  | 'solTransfer'
  | 'stakeFunding'
  | 'stakeWithdraw'
  | 'stakeDeactivate'
  | 'stakeEvent'
  | 'tokenTransfer';

const hiddenStakeEventInstructionTypes: string[] = [
  InstructionType.stakeInitialize,
  InstructionType.stakeDelegate,
  InstructionType.stakeSplit,
];

const getFeesForNextRow = (
  ctx: IParseTransactionContext,
  state: ParseTransactionState,
) => (state.isFeesAlreadyIncluded ? '0' : ctx.fees.toString());

const classifySystemInstruction = (
  instruction: ISolanaInstruction,
): InstructionKind | undefined => {
  if (instruction.parsed.type === InstructionType.transfer) {
    return 'solTransfer';
  }
  if (instruction.parsed.type === InstructionType.createAccountWithSeed) {
    return 'stakeFunding';
  }
  return undefined;
};

const classifyStakeInstruction = (
  instruction: ISolanaInstruction,
): InstructionKind | undefined => {
  const { type } = instruction.parsed;

  if (type === InstructionType.stakeWithdraw) return 'stakeWithdraw';
  if (type === InstructionType.stakeDeactivate) return 'stakeDeactivate';
  if (hiddenStakeEventInstructionTypes.includes(type)) return 'stakeEvent';
  return undefined;
};

const isTokenTransferInstruction = (instruction: ISolanaInstruction) =>
  instruction.parsed.type === InstructionType.transfer ||
  instruction.parsed.type === InstructionType.transferChecked;

const classifyInstruction = (
  ctx: IParseTransactionContext,
  instruction: ISolanaInstruction,
): InstructionKind | undefined => {
  // get the type of instruction: SOL transfer | token transfer | stake
  if (instruction.programId === ctx.systemProgramId) {
    return classifySystemInstruction(instruction);
  }
  if (instruction.programId === ctx.stakeProgramId) {
    return classifyStakeInstruction(instruction);
  }
  if (
    instruction.programId === ctx.tokenProgramId &&
    isTokenTransferInstruction(instruction)
  ) {
    return 'tokenTransfer';
  }
  return undefined;
};

const collectSolTransfer = (
  ctx: IParseTransactionContext,
  state: ParseTransactionState,
  instruction: ISolanaInstruction,
  result: TransactionParserReturnType,
) => {
  // SOL transfer
  const txn = parseCoinTransaction(
    instruction,
    ctx.account,
    ctx.transactionItem,
    getFeesForNextRow(ctx, state),
    state.solTransferInstructionIndex,
  );

  if (txn) {
    result.transactions.push(txn);
    state.recordSolTransferRow();
  }
};

const collectStakeFunding = (
  ctx: IParseTransactionContext,
  state: ParseTransactionState,
  instruction: ISolanaInstruction,
  result: TransactionParserReturnType,
) => {
  const txn = parseStakeFundingTransaction(
    instruction,
    ctx.account,
    ctx.transactionItem,
    getFeesForNextRow(ctx, state),
    state.stakeFundingInstructionIndex,
  );

  if (txn) {
    result.transactions.push(txn);
    state.recordStakeFundingRow();
  }
};

const collectStakeEvent = (
  ctx: IParseTransactionContext,
  state: ParseTransactionState,
  instruction: ISolanaInstruction,
  result: TransactionParserReturnType,
) => {
  result.transactions.push(
    parseStakeEventTransaction(
      instruction,
      ctx.account,
      ctx.transactionItem,
      state.stakeEventInstructionIndex,
    ),
  );
  state.recordStakeEvent();
};

const collectTokenTransfer = async (
  ctx: IParseTransactionContext,
  state: ParseTransactionState,
  instruction: ISolanaInstruction,
  result: TransactionParserReturnType,
) => {
  // spl token transfer
  // In case of token transactions, only save new tokens and fee transactions: token transactions will be synced on token account separately
  const { source } = instruction.parsed.info;
  const mint = await getTokenTransferMint(instruction, ctx.account);

  const newAccounts = await determineAndSaveNewTokenAccounts(
    mint,
    ctx.account,
    ctx.db,
  );
  result.newAccounts.push(...newAccounts);

  state.setSendTokenTxnFound(
    isSendTokenInstruction(source, mint, ctx.account.xpubOrAddress),
  );
};

const collectInstruction = async (
  ctx: IParseTransactionContext,
  state: ParseTransactionState,
  instruction: ISolanaInstruction,
  result: TransactionParserReturnType,
) => {
  const kind = classifyInstruction(ctx, instruction);

  switch (kind) {
    case 'solTransfer':
      collectSolTransfer(ctx, state, instruction, result);
      break;
    case 'stakeFunding':
      collectStakeFunding(ctx, state, instruction, result);
      break;
    case 'stakeWithdraw':
      state.stakeWithdrawInstructions.push(instruction);
      break;
    case 'stakeDeactivate':
      state.stakeDeactivateInstructions.push(instruction);
      break;
    case 'stakeEvent':
      collectStakeEvent(ctx, state, instruction, result);
      break;
    case 'tokenTransfer':
      await collectTokenTransfer(ctx, state, instruction, result);
      break;
    default:
      break;
  }
};

const appendStakeWithdrawRow = (
  ctx: IParseTransactionContext,
  state: ParseTransactionState,
  result: TransactionParserReturnType,
) => {
  if (state.stakeWithdrawInstructions.length === 0) return;

  const txn = parseStakeWithdrawTransactions(
    state.stakeWithdrawInstructions,
    ctx.account,
    ctx.transactionItem,
    getFeesForNextRow(ctx, state),
  );

  if (txn) {
    result.transactions.push(txn);
    state.markFeesIncluded();
  }
};

const appendStakeDeactivateRow = (
  ctx: IParseTransactionContext,
  state: ParseTransactionState,
  result: TransactionParserReturnType,
) => {
  if (
    state.stakeDeactivateInstructions.length === 0 ||
    state.hasVisibleTransferRow
  ) {
    return;
  }

  const txn = parseStakeDeactivateTransactions(
    state.stakeDeactivateInstructions,
    ctx.account,
    ctx.transactionItem,
    getFeesForNextRow(ctx, state),
  );

  if (txn) {
    result.transactions.push(txn);
    state.markFeesIncluded();
  }
};

const appendCreateAccountRows = (
  ctx: IParseTransactionContext,
  result: TransactionParserReturnType,
) => {
  let createAccountInstructionIndex = 0;
  // Parse the createAccount transactions from inner instructions
  for (const innerInstruction of ctx.transactionItem.meta
    ?.innerInstructions?.[0]?.instructions ?? []) {
    if (
      innerInstruction.programId === ctx.systemProgramId &&
      innerInstruction.parsed?.type === InstructionType.createAccount
    ) {
      const txn = parseCreateTokenTransaction(
        innerInstruction,
        ctx.account,
        ctx.transactionItem,
        createAccountInstructionIndex,
      );
      if (txn) {
        result.transactions.push(txn);
        createAccountInstructionIndex += 1;
      }
    }
  }
};

const appendFeeDeductionRow = (
  ctx: IParseTransactionContext,
  state: ParseTransactionState,
  result: TransactionParserReturnType,
) => {
  // Include a fees txn if not already included and any send token txn found
  // In case of send coin txn it will be already included above
  if (
    state.isFeesAlreadyIncluded ||
    !state.isSendTokenTxnFound ||
    ctx.fees.isZero()
  ) {
    return;
  }

  const { account, transactionItem, fees } = ctx;

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

  const ctx: IParseTransactionContext = {
    account,
    transactionItem,
    db,
    fees: new BigNumber(transactionItem.meta?.fee ?? 0),
    systemProgramId: coinSupportWeb3Lib.PublicKey.default.toString(),
    stakeProgramId: coinSupportWeb3Lib.StakeProgram.programId.toString(),
    tokenProgramId: splTokenLib.TOKEN_PROGRAM_ID.toString(),
  };

  const state = new ParseTransactionState();

  // Only iterate through parsable instructions
  for (const instruction of (
    transactionItem.transaction?.message?.instructions ?? []
  ).filter(ins => ins.parsed !== undefined)) {
    await collectInstruction(ctx, state, instruction, result);
  }

  appendStakeWithdrawRow(ctx, state, result);
  appendStakeDeactivateRow(ctx, state, result);
  appendCreateAccountRows(ctx, result);
  appendFeeDeductionRow(ctx, state, result);

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
