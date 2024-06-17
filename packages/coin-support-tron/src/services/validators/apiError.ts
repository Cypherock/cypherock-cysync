import { z } from 'zod';

export const TronApiErrorSchema = z.object({
  error: z.string(),
  success: z.literal(false),
  statusCode: z.number(),
});

export type TronApiError = z.infer<typeof TronApiErrorSchema>;
