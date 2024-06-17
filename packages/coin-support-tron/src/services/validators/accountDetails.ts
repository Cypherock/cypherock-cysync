import { z } from 'zod';
import { TronApiErrorSchema } from './apiError';

const TronAccountDetailSchema = z.object({
  balance: z.number(),
});

export const TronAccountDetailsApiResponseSchema = z.union([
  TronApiErrorSchema,
  z.object({
    data: z.array(TronAccountDetailSchema),
    success: z.literal(true),
  }),
]);

export type TronAccountDetail = z.infer<typeof TronAccountDetailSchema>;
export type TronAccountDetailsApiResponse = z.infer<
  typeof TronAccountDetailsApiResponseSchema
>;
