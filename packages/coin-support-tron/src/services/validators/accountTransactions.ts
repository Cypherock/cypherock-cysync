import { z } from 'zod';
import { TronApiErrorSchema } from './apiErrort';

const InternalTxSchema = z.object({
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

const ParameterSchema = z.object({
  value: z.object({
    // amount: z.number(),
    owner_address: z.string(),
    // to_address: z.string()
  }),
  type_url: z.string(),
});

const ContractSchema = z.object({
  parameter: ParameterSchema,
  type: z.string(),
});

const RawDataSchema = z.object({
  contract: z.array(ContractSchema),
  ref_block_bytes: z.string(),
  ref_block_hash: z.string(),
  expiration: z.number(),
  timestamp: z.number(),
});

const TxSchema = z.object({
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

const TronTransactionsSchema = z.array(z.union([InternalTxSchema, TxSchema]));

export const TronAccountTransactionsApiResponseSchema = z.union([
  TronApiErrorSchema,
  z.object({
    data: TronTransactionsSchema,
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
  }),
]);

export type TronAccountTransactionsApiResponse = z.infer<
  typeof TronAccountTransactionsApiResponseSchema
>;
export type TronTransactions = z.infer<typeof TronTransactionsSchema>;
