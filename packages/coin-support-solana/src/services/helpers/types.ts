import { IAccount, ITransaction } from '@cypherock/db-interfaces';

export enum InstructionType {
  createAccount = 'createAccount',
  transfer = 'transfer',
  transferChecked = 'transferChecked',
}

export interface TransactionParserReturnType {
  transactions: ITransaction[];
  newAccounts: IAccount[];
}

export interface ICustomSolanaTransferInstruction {
  type: InstructionType.transfer;
  amount: number;
  recipient: string;
}

export interface ICustomSolanaTransferCheckedInstruction {
  type: InstructionType.transferChecked;
  amount: number;
  recipient: string;
  mintAddress: string;
  decimals: number;
}

export interface ICustomSolanaCreateAccountInstruction {
  type: InstructionType.createAccount;
  recipient: string;
  mintAddress: string;
}

export type ICustomSolanaInstruction =
  | ICustomSolanaTransferInstruction
  | ICustomSolanaTransferCheckedInstruction
  | ICustomSolanaCreateAccountInstruction;

export interface IConstructTransactionOptions {
  computeUnits?: number;
  computeUnitPrice?: number;
}
