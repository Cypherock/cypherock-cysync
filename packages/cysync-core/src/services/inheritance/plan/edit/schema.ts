import { z } from 'zod';

export const executorMessageSchema = z.string();

export type InheritanceExecutorMessageResponse = z.infer<
  typeof executorMessageSchema
>;
