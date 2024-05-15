import { z } from 'zod';

export const NearBalanceApiResponseSchema = z.object({
  nearBalance: z.number().gte(0),
});
