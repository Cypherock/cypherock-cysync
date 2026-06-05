import { z } from 'zod';

const EthereumSpecificSchema = z.object({
  status: z.number(),
  nonce: z.number(),
});

const TokenTransferSchema = z.object({
  standard: z.string(),
  from: z.string(),
  to: z.string(),
  contract: z.string(),
  name: z.string().optional(),
  symbol: z.string().optional(),
  decimals: z.number().optional(),
  value: z.string(),
  multiTokenValues: z
    .object({
      id: z.string().optional(),
      value: z.string().optional(),
    })
    .optional(),
});

const TransactionInputOutputSchema = z.object({
  n: z.number(),
  addresses: z.array(z.string()).optional(),
  isAddress: z.boolean(),
  value: z.string().optional(),
});

const TransactionSchema = z.object({
  txid: z.string(),
  vin: z.array(TransactionInputOutputSchema),
  vout: z.array(TransactionInputOutputSchema),
  blockHeight: z.number(),
  blockTime: z.number(),
  confirmations: z.number(),
  value: z.string(),
  fees: z.string(),
  ethereumSpecific: EthereumSpecificSchema,
  tokenTransfers: z.array(TokenTransferSchema).optional(),
});
export type TronTransaction = z.infer<typeof TransactionSchema>;

const TokenSchema = z.object({
  standard: z.string(),
  name: z.string(),
  contract: z.string(),
  transfers: z.number(),
  balance: z.string().optional(),
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
