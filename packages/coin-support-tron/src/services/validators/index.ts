import { z } from 'zod';

const TronTXReceiptSchema = z.object({
  status: z.number(),
  fees: z.number(),
  energyusage: z.number(),
  energyfee: z.number(),
  originenergyusage: z.number(),
  energyusagetotal: z.number(),
  netusage: z.number(),
  netfee: z.number(),
});

const TokenTransferSchema = z.object({
  type: z.string(),
  from: z.string(),
  to: z.string(),
  token: z.string(),
  name: z.string(),
  symbol: z.string().optional(),
  decimals: z.number().optional(),
  value: z.string(),
});

const TransactionSchema = z.object({
  txid: z.string(),
  contract_type: z.number(),
  contract_name: z.string(),
  fromAddress: z.string(),
  toAddress: z.string(),
  value: z.string(),
  blockHash: z.string(),
  blockHeight: z.number(),
  confirmations: z.number(),
  blockTime: z.number(),
  fees: z.string(),
  hex: z.string(),
  tronTXReceipt: TronTXReceiptSchema,
  tokenTransfers: z.array(TokenTransferSchema).optional(),
});

const TokenSchema = z.object({
  type: z.string(),
  name: z.string(),
  id: z.string(),
  transfers: z.number(),
  symbol: z.string().optional(),
  decimals: z.number().optional(),
  balance: z.string(),
});

const FrozenListV2Schema = z.object({
  type: z.string(),
  amount: z.number(),
  freezeExpire: z.number(),
});

const DetailsSchema = z.object({
  bandwidthTotal: z.number(),
  bandwidthUsed: z.number(),
  energyTotal: z.number(),
  energyUsed: z.number(),
  tronPower: z.number(),
  tronPowerUsed: z.number(),
  lastWithdraw: z.number(),
  isActive: z.boolean(),
  allowance: z.number(),
  rewards: z.number(),
  isWitness: z.boolean(),
  isElected: z.boolean(),
  type: z.string(),
  frozenListV2: z.array(FrozenListV2Schema).nullable(),
  frozenBalanceV2: z.number(),
  withdrawableBalance: z.number(),
  countUnfreezeLeft: z.number(),
  maxCanDelegateBandwidth: z.number(),
  maxCanDelegateEnergy: z.number(),
});

export const TronTransactionsApiResponseSchema = z.object({
  page: z.number(),
  totalPages: z.number(),
  itemsOnPage: z.number(),
  address: z.string(),
  balance: z.string(),
  txs: z.number(),
  nonTokenTxs: z.number().optional(),
  transactions: z.array(TransactionSchema).optional(),
  tokens: z.array(TokenSchema).optional(),
  details: DetailsSchema,
});

export const TronAccountDetailApiResponseSchema = z.object({
  address: z.string(),
  balance: z.string(),
  txs: z.number(),
  nonTokenTxs: z.number().optional(),
  details: DetailsSchema,
});

export type TronTransactionsApiResponse = z.infer<
  typeof TronTransactionsApiResponseSchema
>;
export type TronAccountDetail = z.infer<
  typeof TronAccountDetailApiResponseSchema
>;
export type TronTransaction = z.infer<typeof TransactionSchema>;
