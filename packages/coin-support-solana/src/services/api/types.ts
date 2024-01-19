export interface ISolanaTransactionResult {
  data: ISolanaTransactionItem[];
  more: boolean;
}

export interface ISolanaTransactionItem {
  blockTime: number;
  confirmationStatus: string;
  err: any;
  memo?: string;
  signature: string;
  slot: number;
  meta?: Meta;
  transaction?: Transaction;
}

interface Meta {
  computeUnitsConsumed?: number;
  err: any;
  fee: number;
  innerInstructions: InnerInstruction[];
  logMessages: string[];
  postBalances: number[];
  postTokenBalances: any[];
  preBalances: number[];
  preTokenBalances: any[];
  rewards: any[];
  status: any;
}

interface InnerInstruction {
  index: number;
  instructions: Instruction[];
}

interface Instruction {
  accounts?: string[];
  data?: string;
  programId: string;
  stackHeight?: any;
  parsed?: any;
  program?: string;
}

interface Transaction {
  message?: Message;
  signatures?: string[];
}

interface Message {
  accountKeys?: AccountKey[];
  instructions?: Instruction[];
  recentBlockhash: string;
}

interface AccountKey {
  pubkey: string;
  signer: boolean;
  source: string;
  writable: boolean;
}
