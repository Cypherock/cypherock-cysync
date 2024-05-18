import { z } from 'zod';

const Action = z.object({
  action: z.string(),
  method: z.string().nullable(),
});

const Outcome = z.object({
  status: z.boolean(),
});

const Block = z.object({
  block_height: z.number(),
});

const OutcomesAgg = z.object({
  transaction_fee: z.number(),
});

const ActionsAgg = z.object({
  deposit: z.number(),
});

const Receipt = z.object({
  transaction_hash: z.string(),
  outcomes: Outcome,
  predecessor_account_id: z.string(),
  receiver_account_id: z.string(),
  actions_agg: ActionsAgg,
  outcomes_agg: OutcomesAgg,
  block_timestamp: z.string(),
  block: Block,
  receipt_id: z.string(),
  included_in_block_hash: z.string(),
  actions: z.array(Action),
  logs: z.array(z.string()),
});

export const NearTransactionsApiResponseSchema = z.array(Receipt);
