import { z } from 'zod';

const TronTXReceiptSchema = z.object({
  status: z.number(),
  fees: z.number(),
  energyusage: z.number().nullish(),
  energyfee: z.number().nullish(),
  originenergyusage: z.number().nullish(),
  energyusagetotal: z.number().nullish(),
  netusage: z.number().nullish(),
  netfee: z.number().nullish(),
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
  balance: z.string(),
  symbol: z.string().optional(),
  decimals: z.number().optional(),
});

const FrozenListV2Schema = z.object({
  type: z.string(),
  amount: z.number(),
  freezeExpire: z.number(),
});

const DetailsSchema = z.object({
  bandwidthTotal: z.number().nullish(),
  bandwidthUsed: z.number().nullish(),
  energyTotal: z.number().nullish(),
  energyUsed: z.number().nullish(),
  tronPower: z.number().nullish(),
  tronPowerUsed: z.number().nullish(),
  lastWithdraw: z.number().nullish(),
  isActive: z.boolean().nullish(),
  allowance: z.number().nullish(),
  rewards: z.number().nullish(),
  isWitness: z.boolean().nullish(),
  isElected: z.boolean().nullish(),
  type: z.string().nullish(),
  frozenListV2: z.array(FrozenListV2Schema).nullish(),
  frozenBalanceV2: z.number().nullish(),
  withdrawableBalance: z.number().nullish(),
  countUnfreezeLeft: z.number().nullish(),
  maxCanDelegateBandwidth: z.number().nullish(),
  maxCanDelegateEnergy: z.number().nullish(),
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
