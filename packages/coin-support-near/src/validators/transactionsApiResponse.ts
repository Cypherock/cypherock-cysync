import { z } from 'zod';

const NearTransaction = z.object({
  transaction_id: z.string(),
  receipt_id: z.string(),
  index: z.number(),
  sender: z.string(),
  receiver: z.string(),
  amount: z.string(),
  status: z.boolean(),
  timestamp: z.string(),
  block_height: z.number(),
  deposit: z.boolean(),
});

export type NearTransaction = z.infer<typeof NearTransaction>;

export const NearTransactionsApiResponseSchema = z.array(NearTransaction);
