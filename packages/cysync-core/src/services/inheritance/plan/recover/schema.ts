import { z } from 'zod';

export const recoverResultSchema = z.object({
  executorMessage: z.string().nullish(),
  encryptedMessage: z.string(),
});

export type InheritanceRecoverPlanResponse = z.infer<
  typeof recoverResultSchema
>;
