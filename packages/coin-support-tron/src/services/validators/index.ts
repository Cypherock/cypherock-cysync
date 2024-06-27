import { z } from 'zod';

const TronTXReceiptSchema = z.object({
  status: z.number(),
  fees: z.number(),
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
  fromAddress: z.string(),
  toAddress: z.string(),
  value: z.string(),
  blockHeight: z.number(),
  blockTime: z.number(),
  fees: z.string(),
  tronTXReceipt: TronTXReceiptSchema,
  tokenTransfers: z.array(TokenTransferSchema).optional(),
});
export type TronTransaction = z.infer<typeof TransactionSchema>;

const TokenSchema = z.object({
  type: z.string(),
  name: z.string(),
  id: z.string(),
  transfers: z.number(),
  balance: z.string(),
  symbol: z.string().optional(),
  decimals: z.number().optional(),
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
});
export type TronTransactionsApiResponse = z.infer<
  typeof TronTransactionsApiResponseSchema
>;

export const TronAddressDetailsApiResponseSchema = z.object({
  data: z.array(
    z.object({
      balance: z.number(),
      trc20: z.array(z.record(z.string())),
    }),
  ),
  success: z.boolean(),
});
export type TronAddressDetailsApiResponse = z.infer<
  typeof TronAddressDetailsApiResponseSchema
>;

export const TronAccountResourcesApiResponseSchema = z.object({
  freeNetLimit: z.number(),
  NetUsed: z.number(),
  NetLimit: z.number(),
  TotalNetLimit: z.number(),
  TotalNetWeight: z.number(),
  EnergyUsed: z.number(),
  EnergyLimit: z.number(),
  TotalEnergyLimit: z.number(),
  TotalEnergyWeight: z.number(),
});
export type TronAccountResourcesApiResponse = z.infer<
  typeof TronAccountResourcesApiResponseSchema
>;
