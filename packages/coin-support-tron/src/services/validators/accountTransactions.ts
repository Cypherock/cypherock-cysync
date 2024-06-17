import { z } from 'zod';
import { TronApiErrorSchema } from './apiError';

const TronInternalTransactionSchema = z.object({
  internal_tx_id: z.string(),
  data: z.object({
    note: z.string(),
    rejected: z.boolean(),
    call_value: z.object({
      _: z.number(),
    }),
  }),
  block_timestamp: z.number(),
  to_address: z.string(),
  tx_id: z.string(),
  from_address: z.string(),
});

const RetSchema = z.object({
  contractRet: z.string(),
  fee: z.number(),
});

export const TransferContractSchema = z.object({
  parameter: z.object({
    value: z.object({
      amount: z.number(),
      owner_address: z.string(),
      to_address: z.string(),
    }),
    type_url: z.string(),
  }),
  type: z.literal('TransferContract'),
});

export const TransferAssetContractSchema = z.object({
  parameter: z.object({
    value: z.object({
      asset_name: z.string(),
      owner_address: z.string(),
      to_address: z.string(),
      amount: z.number(),
    }),
    type_url: z.string(),
  }),
  type: z.literal('TransferAssetContract'),
});

export const CreateSmartContractSchema = z.object({
  parameter: z.object({
    value: z.object({
      owner_address: z.string(),
      new_contract: z.object({
        abi: z.string(),
        bytecode: z.string(),
      }),
      call_token_value: z.number(),
      token_id: z.number(),
    }),
    type_url: z.string(),
  }),
  type: z.literal('CreateSmartContract'),
});

export const RawDataSchema = z.object({
  contract: z.array(
    z.union([
      TransferContractSchema,
      TransferAssetContractSchema,
      CreateSmartContractSchema,
      z.any(),
    ]),
  ),
  ref_block_bytes: z.string(),
  ref_block_hash: z.string(),
  expiration: z.number(),
  timestamp: z.number(),
});

export const TronNormalTransactionSchema = z.object({
  ret: z.array(RetSchema),
  signature: z.array(z.string()),
  txID: z.string(),
  net_usage: z.number(),
  raw_data_hex: z.string(),
  net_fee: z.number(),
  energy_usage: z.number(),
  blockNumber: z.number(),
  block_timestamp: z.number(),
  energy_fee: z.number(),
  energy_usage_total: z.number(),
  raw_data: RawDataSchema,
  internal_transactions: z.array(z.unknown()),
});

const TronTransactionSchema = z.union([
  TronInternalTransactionSchema,
  TronNormalTransactionSchema,
]);

export const TronAccountTransactionsApiResponseSchema = z.object({
  data: z.array(TronTransactionSchema),
  success: z.literal(true),
  meta: z.object({
    at: z.number(),
    fingerprint: z.string().optional(),
    links: z
      .object({
        next: z.string().url(),
      })
      .optional(),
    page_size: z.number().nonnegative(),
  }),
});

export const TronAccountTransactionsApiResponseWithErrorSchema = z.union([
  TronApiErrorSchema,
  TronAccountTransactionsApiResponseSchema,
]);

export type TronAccountTransactionsApiResponse = z.infer<
  typeof TronAccountTransactionsApiResponseSchema
>;

export type TronAccountTransactionsApiResponseWithError = z.infer<
  typeof TronAccountTransactionsApiResponseWithErrorSchema
>;

export type TronInternalTransaction = z.infer<
  typeof TronInternalTransactionSchema
>;

export type TronNormalTransaction = z.infer<typeof TronNormalTransactionSchema>;

export type TronTransaction = z.infer<typeof TronTransactionSchema>;
