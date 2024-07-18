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

const AddressDetailsSchema = z.object({
  bandwidthTotal: z.number().optional(),
  bandwidthUsed: z.number().optional(),
  energyTotal: z.number().optional(),
  energyUsed: z.number().optional(),
  tronPower: z.number().optional(),
  tronPowerUsed: z.number().optional(),
  isActive: z.boolean().optional(),
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

export const TronAccountDetailsApiResponseSchema = z.object({
  address: z.string(),
  balance: z.string(),
  txs: z.number(),
  nonTokenTxs: z.number().optional(),
  details: AddressDetailsSchema.optional(),
});

export type TronAccountDetailsApiResponse = z.infer<
  typeof TronAccountDetailsApiResponseSchema
>;

export const TronTriggerConstantContractCallApiResponseSchema = z.object({
  result: z.object({
    result: z.boolean(),
  }),
  energy_used: z.number().optional(),
  energy_penalty: z.number().optional(),
  constant_result: z.array(z.string()),
});
export type TronTriggerConstantContractCallApiResponse = z.infer<
  typeof TronTriggerConstantContractCallApiResponseSchema
>;

export const TronTriggerConstantContractCallWithErrorApiResponseSchema =
  z.union([
    z.object({
      result: z.object({
        code: z.string(),
        message: z.string(),
      }),
    }),
    TronTriggerConstantContractCallApiResponseSchema,
  ]);
