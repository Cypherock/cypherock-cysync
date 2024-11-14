import { z } from 'zod';

export const recoverResultSchema = z.object({
  executorMessage: z.string().nullish(),
  encryptedMessage: z.string().optional(),
});

export type InheritanceRecoverPlanResponse = z.infer<
  typeof recoverResultSchema
>;
