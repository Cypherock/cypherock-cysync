import { z } from 'zod';

export const editExecutorMessageResponseSchema = z.object({
  success: z.boolean(),
});

export type InheritanceEditExecutorMessageResponse = z.infer<
  typeof editExecutorMessageResponseSchema
>;
